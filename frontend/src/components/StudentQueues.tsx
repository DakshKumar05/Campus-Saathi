import { useState } from 'react';
import { BellRing, Clock, MapPin, PauseCircle, Ticket, Users } from 'lucide-react';
import type { QueueSummary, StudentToken } from '../data/types';
import { api, errorMessage } from '../lib/api';
import { usePolling, waitLabel } from '../lib/usePolling';
import { useToast } from './Toast';
import { EmptyState, ErrorState, SkeletonRows } from './ui';

interface Data { queues: QueueSummary[]; tokens: StudentToken[] }

const loadAll = async (): Promise<Data> => {
  const [q, t] = await Promise.all([
    api<{ queues: QueueSummary[] }>('/queues'),
    api<{ tokens: StudentToken[] }>('/queues/my-tokens'),
  ]);
  return { queues: q.queues, tokens: t.tokens };
};

function TokenCard({ token, busy, onCancel }: { token: StudentToken; busy: boolean; onCancel: () => void }) {
  const yourTurn = token.status === 'in_progress';
  return (
    <li style={{ padding: '16px 18px' }}>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ minWidth: 0 }}>
          <div className="small muted">{token.queueName}</div>
          <div className="mono" style={{ fontSize: 30, fontWeight: 600, color: 'var(--brand)', lineHeight: 1.2 }} aria-label={`Token ${token.tokenNumber}`}>
            {token.tokenNumber}
          </div>
          {token.purpose && <div className="small text-2">{token.purpose}</div>}
        </div>
        {yourTurn
          ? <span className="badge resolved lg"><BellRing size={13} /> It’s your turn</span>
          : token.isPaused
            ? <span className="badge waiting lg"><PauseCircle size={13} /> Queue paused</span>
            : <span className="badge new lg">Waiting</span>}
      </div>

      {yourTurn ? (
        <div className="alert info" style={{ marginTop: 12 }} role="status">
          <MapPin size={16} />
          <span><strong>Go to the counter now:</strong> {token.location}</span>
        </div>
      ) : (
        <dl className="dl" style={{ marginTop: 12 }}>
          <dt>Position</dt>
          <dd><strong>Position #{token.position} in line</strong></dd>
          <dt>Estimated wait</dt>
          <dd className="row" style={{ gap: 6 }}><Clock size={14} className="muted" /> {waitLabel(token.estimatedWaitMinutes)}</dd>
          <dt>Now serving</dt>
          <dd className="mono">{token.nowServing ?? '—'}</dd>
          <dt>Where</dt>
          <dd>{token.location}</dd>
        </dl>
      )}

      {!yourTurn && (
        <div className="row" style={{ marginTop: 12, justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary btn-sm" onClick={onCancel} disabled={busy}>
            {busy ? 'Cancelling…' : 'Cancel Request'}
          </button>
        </div>
      )}
    </li>
  );
}

/** Student-facing Campus Queue Manager: live token cards plus every service queue with a Join button. */
export function StudentQueues({ compact = false }: { compact?: boolean }) {
  const notify = useToast();
  const { data, error, reload, setData } = usePolling(loadAll, 5000);
  const [busy, setBusy] = useState('');
  const [bannerError, setBannerError] = useState('');

  const join = (q: QueueSummary) => {
    setBusy(q.id);
    setBannerError('');
    api<{ token: StudentToken }>(`/queues/${q.id}/join`, { body: {} })
      .then(({ token }) => {
        notify(`Token ${token.tokenNumber} issued`, `Position #${token.position} in line for ${q.name}.`);
        return reload();
      })
      .catch((e) => { setBannerError(errorMessage(e)); notify('Couldn’t join the queue', errorMessage(e), 'error'); reload(); })
      .finally(() => setBusy(''));
  };

  const cancel = (t: StudentToken) => {
    setBusy(t.id);
    setBannerError('');
    api(`/tokens/${t.id}/cancel`, { body: {} })
      .then(() => {
        setData((d) => (d ? { ...d, tokens: d.tokens.filter((x) => x.id !== t.id) } : d));
        notify(`Token ${t.tokenNumber} cancelled`, 'Everyone behind you has moved up one place.');
        return reload();
      })
      .catch((e) => { setBannerError(errorMessage(e)); notify('Couldn’t cancel this token', errorMessage(e), 'error'); })
      .finally(() => setBusy(''));
  };

  if (!data) {
    return error
      ? <section className="panel"><ErrorState title="Queues couldn’t be loaded" action={<button className="btn btn-secondary" onClick={() => reload()}>Try again</button>}>{error}</ErrorState></section>
      : <section className="panel"><SkeletonRows rows={3} cols={3} /></section>;
  }

  const held = new Set(data.tokens.map((t) => t.queueId));

  return (
    <div className="stack">
      {bannerError && <div className="alert danger" role="alert"><PauseCircle size={16} /><span>{bannerError}</span></div>}
      {error && <div className="alert warn" role="status"><Clock size={16} /><span>Live updates paused — {error}</span></div>}

      <section className="panel" aria-live="polite">
        <div className="panel-head">
          <h2>Your active tokens</h2>
          <span className="hint">Updates every few seconds</span>
        </div>
        {data.tokens.length === 0 ? (
          <EmptyState icon={<Ticket size={20} />} title="You’re not in any queue">
            Join a queue below and wait wherever you like. We’ll show your place in line here.
          </EmptyState>
        ) : (
          <ul className="list">
            {data.tokens.map((t) => <TokenCard key={t.id} token={t} busy={busy === t.id} onCancel={() => cancel(t)} />)}
          </ul>
        )}
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Campus service queues</h2>
          {!compact && <span className="hint">{data.queues.length} services</span>}
        </div>
        <ul className="list">
          {data.queues.map((q) => (
            <li key={q.id}>
              <div className="list-link" style={{ alignItems: 'flex-start' }}>
                <span className="icon-box"><Users size={18} /></span>
                <span className="ll-main">
                  <span className="row" style={{ gap: 8 }}>
                    <span className="ll-title">{q.name}</span>
                    {q.isPaused ? <span className="badge waiting">Paused</span> : <span className="badge resolved">Active</span>}
                  </span>
                  {!compact && <span className="ll-sub" style={{ display: 'block' }}>{q.description}</span>}
                  <span className="ll-sub row" style={{ gap: 12, marginTop: 4 }}>
                    <span className="row" style={{ gap: 4 }}><MapPin size={13} /> {q.location}</span>
                    <span>{q.waiting} waiting</span>
                    <span>Serving <span className="mono">{q.nowServing ?? '—'}</span></span>
                    {!q.isPaused && <span>{q.estimatedWaitMinutes <= 0 ? 'No wait' : waitLabel(q.estimatedWaitMinutes)}</span>}
                  </span>
                </span>
                <button
                  className={`btn btn-sm ${held.has(q.id) ? 'btn-secondary' : 'btn-primary'}`}
                  disabled={q.isPaused || held.has(q.id) || busy === q.id}
                  onClick={() => join(q)}
                  title={q.isPaused ? 'This queue is paused by staff' : undefined}
                >
                  {held.has(q.id) ? 'In queue' : busy === q.id ? 'Joining…' : q.isPaused ? 'Paused' : 'Join Queue'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
