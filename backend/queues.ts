import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { z } from 'zod';
import type {
  QueueStats, QueueSummary, QueueTokenStatus, StaffQueueView, StudentToken,
} from '../frontend/src/data/types';
import { db, tx } from './db';
import { requireRole } from './auth';
import { HttpError, handler } from './http';

/* ---------- validation ---------- */

const queueParams = z.object({ id: z.string().regex(/^[a-z0-9-]{1,40}$/, 'Unknown queue.') });
const tokenParams = z.object({ id: z.uuid('Unknown token.') });
const joinBody = z.object({
  purpose: z.string().trim().min(2, 'Tell the counter what you need (at least 2 characters).').max(120, 'Keep the reason under 120 characters.').optional(),
}).strict();
const pauseBody = z.object({ paused: z.boolean().optional() }).strict();

function parse<T>(schema: z.ZodType<T>, data: unknown): T {
  const r = schema.safeParse(data ?? {});
  if (!r.success) throw new HttpError(400, r.error.issues[0]?.message ?? 'Invalid request.');
  return r.data;
}

/* ---------- rows & helpers ---------- */

interface QueueRow {
  id: string; name: string; service_type: QueueSummary['serviceType']; department_id: string; prefix: string;
  location: string; description: string; next_number: number; avg_service_minutes: number; is_paused: number; created_at: string;
}
interface TokenRow {
  id: string; queue_id: string; student_id: string; token_number: string; purpose: string | null;
  status: QueueTokenStatus; position: number | null; created_at: string; called_at: string | null; completed_at: string | null;
}

const now = () => new Date().toISOString();
const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.toISOString(); };
const minutesBetween = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / 60000;
const round1 = (n: number) => Math.round(n * 10) / 10;

function loadQueue(id: string): QueueRow {
  const q = db.prepare('SELECT * FROM queues WHERE id = ?').get(id) as QueueRow | undefined;
  if (!q) throw new HttpError(404, 'That queue doesn’t exist.');
  return q;
}

/** Average minutes a student spends at the counter, from today's completed tokens; falls back to the queue's default. */
function avgServiceMinutes(q: QueueRow): number {
  const rows = db.prepare(`SELECT called_at, completed_at FROM queue_tokens
    WHERE queue_id = ? AND status = 'completed' AND called_at IS NOT NULL AND completed_at >= ?`).all(q.id, startOfToday()) as { called_at: string; completed_at: string }[];
  if (rows.length === 0) return q.avg_service_minutes;
  const avg = rows.reduce((sum, r) => sum + minutesBetween(r.called_at, r.completed_at), 0) / rows.length;
  return Math.min(60, Math.max(1, avg));
}

function serving(queueId: string): TokenRow | undefined {
  return db.prepare(`SELECT * FROM queue_tokens WHERE queue_id = ? AND status = 'in_progress' ORDER BY called_at DESC LIMIT 1`).get(queueId) as TokenRow | undefined;
}

/** Minutes until the student at `position` is called: what's left of the current service plus everyone ahead. */
function estimateWait(q: QueueRow, position: number): number {
  const avg = avgServiceMinutes(q);
  const current = serving(q.id);
  const remaining = current?.called_at ? Math.max(1, avg - minutesBetween(current.called_at, now())) : 0;
  return Math.round(remaining + (position - 1) * avg);
}

/** Re-number waiting tokens 1..n in their existing order, so cancellations and calls never leave gaps. */
function renumber(queueId: string) {
  const waiting = db.prepare(`SELECT id FROM queue_tokens WHERE queue_id = ? AND status = 'waiting' ORDER BY position, created_at`).all(queueId) as { id: string }[];
  const upd = db.prepare('UPDATE queue_tokens SET position = ? WHERE id = ?');
  waiting.forEach((t, i) => upd.run(i + 1, t.id));
}

const waitingCount = (queueId: string) =>
  (db.prepare(`SELECT COUNT(*) AS n FROM queue_tokens WHERE queue_id = ? AND status = 'waiting'`).get(queueId) as { n: number }).n;

function toSummary(q: QueueRow): QueueSummary {
  const waiting = waitingCount(q.id);
  return {
    id: q.id, name: q.name, serviceType: q.service_type, departmentId: q.department_id, prefix: q.prefix,
    location: q.location, description: q.description, isPaused: q.is_paused === 1,
    waiting, nowServing: serving(q.id)?.token_number ?? null,
    estimatedWaitMinutes: estimateWait(q, waiting + 1),
  };
}

function toStudentToken(t: TokenRow): StudentToken {
  const q = loadQueue(t.queue_id);
  return {
    id: t.id, queueId: q.id, queueName: q.name, location: q.location, tokenNumber: t.token_number, purpose: t.purpose,
    status: t.status, position: t.position, createdAt: t.created_at, calledAt: t.called_at, isPaused: q.is_paused === 1,
    estimatedWaitMinutes: t.status === 'waiting' && t.position ? estimateWait(q, t.position) : 0,
    nowServing: serving(q.id)?.token_number ?? null,
  };
}

function stats(q: QueueRow): QueueStats {
  const today = startOfToday();
  const served = db.prepare(`SELECT created_at, called_at, completed_at FROM queue_tokens
    WHERE queue_id = ? AND status = 'completed' AND completed_at >= ?`).all(q.id, today) as { created_at: string; called_at: string | null; completed_at: string }[];
  const called = db.prepare(`SELECT created_at, called_at FROM queue_tokens
    WHERE queue_id = ? AND called_at IS NOT NULL AND called_at >= ?`).all(q.id, today) as { created_at: string; called_at: string }[];
  const cancelled = (db.prepare(`SELECT COUNT(*) AS n FROM queue_tokens
    WHERE queue_id = ? AND status = 'cancelled' AND completed_at >= ?`).get(q.id, today) as { n: number }).n;
  const handled = served.filter((s) => s.called_at);
  return {
    queueId: q.id,
    servedToday: served.length,
    waiting: waitingCount(q.id),
    inProgress: serving(q.id) ? 1 : 0,
    cancelledToday: cancelled,
    avgWaitMinutes: called.length ? round1(called.reduce((s, t) => s + minutesBetween(t.created_at, t.called_at), 0) / called.length) : null,
    avgHandlingMinutes: handled.length ? round1(handled.reduce((s, t) => s + minutesBetween(t.called_at!, t.completed_at), 0) / handled.length) : null,
  };
}

function staffView(q: QueueRow): StaffQueueView {
  const rows = db.prepare(`SELECT t.*, s.name AS student_name, s.student_number FROM queue_tokens t JOIN students s ON s.id = t.student_id
    WHERE t.queue_id = ? AND t.status IN ('waiting', 'in_progress') ORDER BY t.status = 'waiting', t.position`).all(q.id) as unknown as (TokenRow & { student_name: string; student_number: string })[];
  const toEntry = (t: (typeof rows)[number]) => ({
    id: t.id, tokenNumber: t.token_number, studentName: t.student_name, studentNumber: t.student_number,
    purpose: t.purpose, position: t.position, createdAt: t.created_at, calledAt: t.called_at,
  });
  const current = rows.find((t) => t.status === 'in_progress');
  return {
    queue: toSummary(q),
    serving: current ? toEntry(current) : null,
    waiting: rows.filter((t) => t.status === 'waiting').map(toEntry),
    stats: stats(q),
  };
}

/* ---------- routes ---------- */

export const queuesRouter = Router();

// Any signed-in user can see the queues.
queuesRouter.get('/queues', requireRole(), handler((_req, res) => {
  const rows = db.prepare('SELECT * FROM queues ORDER BY created_at, name').all() as unknown as QueueRow[];
  res.json({ queues: rows.map(toSummary) });
}));

// Declared before /queues/:id/* so "my-tokens" is never read as a queue id.
queuesRouter.get('/queues/my-tokens', requireRole('student'), handler((req, res) => {
  const rows = db.prepare(`SELECT * FROM queue_tokens WHERE student_id = ? AND status IN ('waiting', 'in_progress')
    ORDER BY created_at`).all(req.user!.id) as unknown as TokenRow[];
  res.json({ tokens: rows.map(toStudentToken) });
}));

queuesRouter.post('/queues/:id/join', requireRole('student'), handler((req, res) => {
  const { id } = parse(queueParams, req.params);
  const { purpose } = parse(joinBody, req.body);
  const token = tx(() => {
    const q = loadQueue(id);
    if (q.is_paused) throw new HttpError(409, `${q.name} is currently paused by staff. Try again shortly.`);
    const existing = db.prepare(`SELECT token_number FROM queue_tokens WHERE queue_id = ? AND student_id = ? AND status IN ('waiting', 'in_progress')`)
      .get(q.id, req.user!.id) as { token_number: string } | undefined;
    if (existing) throw new HttpError(409, `You already have token ${existing.token_number} in this queue.`);

    // Inside BEGIN IMMEDIATE, so two students joining at the same moment can never get the same number.
    const tokenNumber = `${q.prefix}-${String(q.next_number).padStart(3, '0')}`;
    db.prepare('UPDATE queues SET next_number = next_number + 1 WHERE id = ?').run(q.id);
    const tokenId = randomUUID();
    db.prepare(`INSERT INTO queue_tokens (id, queue_id, student_id, token_number, purpose, status, position, created_at)
      VALUES (?,?,?,?,?,'waiting',?,?)`).run(tokenId, q.id, req.user!.id, tokenNumber, purpose ?? null, waitingCount(q.id) + 1, now());
    return db.prepare('SELECT * FROM queue_tokens WHERE id = ?').get(tokenId) as unknown as TokenRow;
  });
  res.status(201).json({ token: toStudentToken(token) });
}));

queuesRouter.post('/tokens/:id/cancel', requireRole('student'), handler((req, res) => {
  const { id } = parse(tokenParams, req.params);
  const token = tx(() => {
    const t = db.prepare('SELECT * FROM queue_tokens WHERE id = ? AND student_id = ?').get(id, req.user!.id) as TokenRow | undefined;
    if (!t) throw new HttpError(404, 'That token wasn’t found.');
    if (t.status === 'in_progress') throw new HttpError(409, 'You’re already being served at the counter, so this can’t be cancelled.');
    if (t.status !== 'waiting') throw new HttpError(409, `Token ${t.token_number} is already ${t.status}.`);
    db.prepare(`UPDATE queue_tokens SET status = 'cancelled', position = NULL, completed_at = ? WHERE id = ?`).run(now(), t.id);
    renumber(t.queue_id);
    return { ...t, status: 'cancelled' as const, position: null };
  });
  res.json({ token: { id: token.id, tokenNumber: token.token_number, status: token.status } });
}));

queuesRouter.get('/queues/:id', requireRole('staff', 'admin'), handler((req, res) => {
  const { id } = parse(queueParams, req.params);
  res.json(staffView(loadQueue(id)));
}));

queuesRouter.post('/queues/:id/call-next', requireRole('staff', 'admin'), handler((req, res) => {
  const { id } = parse(queueParams, req.params);
  const result = tx(() => {
    const q = loadQueue(id);
    const at = now();
    const done = db.prepare(`UPDATE queue_tokens SET status = 'completed', completed_at = ? WHERE queue_id = ? AND status = 'in_progress'`).run(at, q.id);
    const next = db.prepare(`SELECT * FROM queue_tokens WHERE queue_id = ? AND status = 'waiting' ORDER BY position, created_at LIMIT 1`).get(q.id) as TokenRow | undefined;
    if (next) {
      db.prepare(`UPDATE queue_tokens SET status = 'in_progress', called_at = ?, position = NULL WHERE id = ?`).run(at, next.id);
      renumber(q.id);
    }
    return { q, completed: Number(done.changes) > 0, called: next?.token_number ?? null };
  });
  res.json({ ...staffView(result.q), completed: result.completed, called: result.called });
}));

queuesRouter.patch('/queues/:id/toggle-pause', requireRole('staff', 'admin'), handler((req, res) => {
  const { id } = parse(queueParams, req.params);
  const { paused } = parse(pauseBody, req.body);
  const q = loadQueue(id);
  const next = paused ?? q.is_paused === 0;
  db.prepare('UPDATE queues SET is_paused = ? WHERE id = ?').run(next ? 1 : 0, q.id);
  res.json(staffView(loadQueue(id)));
}));

queuesRouter.get('/queues/:id/stats', requireRole('staff', 'admin'), handler((req, res) => {
  const { id } = parse(queueParams, req.params);
  res.json({ stats: stats(loadQueue(id)) });
}));
