import { DatabaseSync } from 'node:sqlite';
import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { ADMIN, DEPARTMENTS, STAFF, STUDENTS } from '../frontend/src/data/directory';
import { buildSeed } from '../frontend/src/data/seed';
import type { ActivityEntry, Case } from '../frontend/src/data/types';
import { hashPassword, verifyPassword } from './passwords';

export const DB_PATH = process.env.DB_PATH ?? path.resolve('data', 'campuscare.db');
mkdirSync(path.dirname(DB_PATH), { recursive: true });

export const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');

db.exec(`
  CREATE TABLE IF NOT EXISTS departments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    team TEXT NOT NULL,
    description TEXT NOT NULL,
    helps_with TEXT NOT NULL,           -- JSON array
    location TEXT NOT NULL,
    hours TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    target_response TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    preferred_name TEXT NOT NULL,
    student_number TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    programme TEXT NOT NULL,
    faculty TEXT NOT NULL,
    year TEXT NOT NULL,
    mode TEXT NOT NULL,
    fee_status TEXT NOT NULL,
    tutor TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS staff (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    department_id TEXT NOT NULL REFERENCES departments(id),
    email TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,                -- same id as the student / staff / admin record
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'staff', 'admin')),
    name TEXT NOT NULL,
    title TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS cases (
    id TEXT PRIMARY KEY,
    seq INTEGER NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    student_id TEXT NOT NULL REFERENCES students(id),
    department_id TEXT NOT NULL REFERENCES departments(id),
    category TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')),
    status TEXT NOT NULL CHECK (status IN ('New', 'In Progress', 'Waiting', 'Resolved')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    assignee_id TEXT REFERENCES staff(id),
    contact_preference TEXT NOT NULL,
    triage TEXT NOT NULL,               -- JSON
    resolution_at TEXT,
    resolution_by TEXT,
    resolution_text TEXT
  );
  CREATE INDEX IF NOT EXISTS cases_student ON cases(student_id);
  CREATE INDEX IF NOT EXISTS cases_department ON cases(department_id);

  CREATE TABLE IF NOT EXISTS activity (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    at TEXT NOT NULL,
    kind TEXT NOT NULL,
    actor TEXT NOT NULL,
    text TEXT NOT NULL,
    body TEXT,
    internal INTEGER NOT NULL DEFAULT 0
  );
  CREATE INDEX IF NOT EXISTS activity_case ON activity(case_id, at);

  -- Campus Queue Manager
  CREATE TABLE IF NOT EXISTS queues (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    service_type TEXT NOT NULL CHECK (service_type IN ('certificates', 'helpdesk', 'lab_booking')),
    department_id TEXT NOT NULL REFERENCES departments(id),
    prefix TEXT NOT NULL UNIQUE,         -- token prefix, e.g. CERT
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    next_number INTEGER NOT NULL,        -- next token number to hand out
    avg_service_minutes INTEGER NOT NULL DEFAULT 5, -- fallback until real data exists
    is_paused INTEGER NOT NULL DEFAULT 0 CHECK (is_paused IN (0, 1)),
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS queue_tokens (
    id TEXT PRIMARY KEY,
    queue_id TEXT NOT NULL REFERENCES queues(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL REFERENCES students(id),
    token_number TEXT NOT NULL,
    purpose TEXT,
    status TEXT NOT NULL CHECK (status IN ('waiting', 'in_progress', 'completed', 'cancelled')),
    position INTEGER,                    -- 1-based while waiting, NULL otherwise
    created_at TEXT NOT NULL,
    called_at TEXT,
    completed_at TEXT,
    UNIQUE (queue_id, token_number)
  );
  CREATE INDEX IF NOT EXISTS queue_tokens_queue ON queue_tokens(queue_id, status, position);
  CREATE INDEX IF NOT EXISTS queue_tokens_student ON queue_tokens(student_id, status);
  -- A student can hold only one active token per queue, enforced by the database itself.
  CREATE UNIQUE INDEX IF NOT EXISTS queue_tokens_one_active
    ON queue_tokens(queue_id, student_id) WHERE status IN ('waiting', 'in_progress');
`);

export function tx<T>(fn: () => T): T {
  db.exec('BEGIN IMMEDIATE');
  try {
    const out = fn();
    db.exec('COMMIT');
    return out;
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
}

export const DEMO_PASSWORD = process.env.DEMO_PASSWORD ?? 'CampusSaathi2026';

function seedDirectory() {
  const insDept = db.prepare(`INSERT INTO departments VALUES (?,?,?,?,?,?,?,?,?,?)`);
  for (const d of DEPARTMENTS) {
    insDept.run(d.id, d.name, d.team, d.description, JSON.stringify(d.helpsWith), d.location, d.hours, d.phone, d.email, d.targetResponse);
  }
  const insStudent = db.prepare(`INSERT INTO students VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`);
  const insStaff = db.prepare(`INSERT INTO staff VALUES (?,?,?,?,?)`);
  const insUser = db.prepare(`INSERT INTO users VALUES (?,?,?,?,?,?)`);
  const hash = hashPassword(DEMO_PASSWORD); // one hash is enough for demo accounts
  for (const s of STUDENTS) {
    insStudent.run(s.id, s.name, s.preferredName, s.studentNumber, s.email, s.phone, s.programme, s.faculty, s.year, s.mode, s.feeStatus, s.tutor);
    insUser.run(s.id, s.email, hash, 'student', s.name, `${s.programme} · ${s.year}`);
  }
  for (const m of STAFF) {
    insStaff.run(m.id, m.name, m.title, m.departmentId, m.email);
    insUser.run(m.id, m.email, hash, 'staff', m.name, m.title);
  }
  insUser.run(ADMIN.id, ADMIN.email, hash, 'admin', ADMIN.name, ADMIN.title);
}

export function insertCase(c: Case) {
  db.prepare(`INSERT INTO cases VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
    c.id, parseInt(c.id.slice(2), 10), c.title, c.description, c.studentId, c.departmentId, c.category, c.priority, c.status,
    c.createdAt, c.updatedAt, c.assigneeId, c.contactPreference, JSON.stringify(c.triage),
    c.resolution?.at ?? null, c.resolution?.by ?? null, c.resolution?.text ?? null,
  );
  for (const a of c.activity) insertActivity(c.id, a);
}

export function insertActivity(caseId: string, a: ActivityEntry) {
  db.prepare(`INSERT INTO activity VALUES (?,?,?,?,?,?,?,?)`).run(
    a.id, caseId, a.at, a.kind, a.actor, a.text, a.body ?? null, a.internal ? 1 : 0,
  );
}

export function seedCases() {
  tx(() => {
    db.exec('DELETE FROM activity; DELETE FROM cases;');
    for (const c of buildSeed()) insertCase(c);
  });
}

interface SeedQueue {
  id: string; name: string; serviceType: string; departmentId: string; prefix: string;
  location: string; description: string; start: number; avg: number; paused: boolean;
}
const SEED_QUEUES: SeedQueue[] = [
  { id: 'certificates', name: 'Certificate & Marksheet Counter', serviceType: 'certificates', departmentId: 'registry', prefix: 'CERT', location: 'Counter 2, Registry, Administrative Block', description: 'Bonafide certificates, marksheets, transcripts and Community Connect certificates.', start: 101, avg: 6, paused: false },
  { id: 'it-helpdesk', name: 'IT Helpdesk & Laptop Support', serviceType: 'helpdesk', departmentId: 'it', prefix: 'IT', location: 'IT Service Desk, Library Ground Floor', description: 'Password resets, Wi-Fi and portal access, and laptop repairs.', start: 201, avg: 8, paused: false },
  { id: 'robotics-lab', name: 'Robotics & Embedded Systems Lab Booking', serviceType: 'lab_booking', departmentId: 'advising', prefix: 'LAB', location: 'Lab E-204, Engineering Block', description: 'Book a bench, oscilloscope, or microcontroller kit for your project.', start: 41, avg: 10, paused: true },
];

/** Seeds the three demo queues and a handful of live tokens. Times are relative to now so the demo always looks "today". */
export function seedQueues() {
  tx(() => {
    db.exec('DELETE FROM queue_tokens; DELETE FROM queues;');
    const created = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const insQ = db.prepare('INSERT INTO queues VALUES (?,?,?,?,?,?,?,?,?,?,?)');
    for (const q of SEED_QUEUES) insQ.run(q.id, q.name, q.serviceType, q.departmentId, q.prefix, q.location, q.description, q.start, q.avg, q.paused ? 1 : 0, created);

    const ago = (min: number) => new Date(Date.now() - min * 60 * 1000).toISOString();
    const insT = db.prepare('INSERT INTO queue_tokens VALUES (?,?,?,?,?,?,?,?,?,?)');
    const token = (queueId: string, studentId: string, purpose: string | null, status: string, position: number | null, createdMin: number, calledMin: number | null, doneMin: number | null) => {
      const q = db.prepare('SELECT prefix, next_number FROM queues WHERE id = ?').get(queueId) as { prefix: string; next_number: number };
      db.prepare('UPDATE queues SET next_number = next_number + 1 WHERE id = ?').run(queueId);
      insT.run(randomUUID(), queueId, studentId, `${q.prefix}-${String(q.next_number).padStart(3, '0')}`, purpose, status, position,
        ago(createdMin), calledMin === null ? null : ago(calledMin), doneMin === null ? null : ago(doneMin));
    };
    // Certificates: two served earlier today, one at the counter, three waiting (Abhilash is #3).
    token('certificates', 'st-2184412', 'Transcript', 'completed', null, 95, 80, 74);
    token('certificates', 'st-2203371', 'Marksheet copy', 'completed', null, 88, 74, 67);
    token('certificates', 'st-2310958', 'Bonafide Certificate', 'in_progress', null, 60, 4, null);
    token('certificates', 'st-2296604', 'Bonafide Certificate', 'waiting', 1, 40, null, null);
    token('certificates', 'st-2402218', 'Community Connect Verification', 'waiting', 2, 25, null, null);
    token('certificates', 'st-2291047', 'Bonafide Certificate', 'waiting', 3, 12, null, null);
    // IT helpdesk: one served, one waiting (Abhilash again, different service).
    token('it-helpdesk', 'st-2209926', 'Laptop won’t connect to Wi-Fi', 'completed', null, 70, 55, 44);
    token('it-helpdesk', 'st-2291047', 'ERP portal password reset', 'waiting', 1, 8, null, null);
    // Robotics lab: paused, one student already waiting.
    token('robotics-lab', 'st-2166437', 'Oscilloscope bench for final-year project', 'waiting', 1, 50, null, null);
  });
}

const syncDept = db.prepare('UPDATE departments SET name = ?, team = ?, description = ?, helps_with = ? WHERE id = ?');
for (const d of DEPARTMENTS) syncDept.run(d.name, d.team, d.description, JSON.stringify(d.helpsWith), d.id);

db.prepare("UPDATE activity SET actor = REPLACE(actor, 'CampusCare', 'Campus Saathi') WHERE actor LIKE 'CampusCare%'").run();

const LEGACY_DEMO_PASSWORD = 'CampusCare2026';
const sample = db.prepare('SELECT password_hash FROM users LIMIT 1').get() as { password_hash: string } | undefined;
if (sample && !verifyPassword(DEMO_PASSWORD, sample.password_hash) && verifyPassword(LEGACY_DEMO_PASSWORD, sample.password_hash)) {
  db.prepare('UPDATE users SET password_hash = ?').run(hashPassword(DEMO_PASSWORD));
  console.log('Updated demo accounts to the current demo password.');
}

const hasDirectory = db.prepare('SELECT COUNT(*) AS n FROM departments').get() as { n: number };
if (hasDirectory.n === 0) {
  tx(seedDirectory);
  seedCases();
  console.log(`Seeded new database at ${DB_PATH}`);
}

const hasQueues = db.prepare('SELECT COUNT(*) AS n FROM queues').get() as { n: number };
if (hasQueues.n === 0) {
  seedQueues();
  console.log('Seeded Campus Queue Manager demo queues.');
}
