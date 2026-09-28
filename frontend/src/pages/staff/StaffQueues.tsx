import { useEffect, useState } from 'react';
import { BellRing, PauseCircle, PlayCircle, Users } from 'lucide-react';
import type { QueueSummary, StaffQueueView } from '../../data/types';
import { api, errorMessage } from '../../lib/api';
import { relativeTime } from '../../lib/format';
import { useTitle } from '../../lib/hooks';
import { usePolling } from '../../lib/usePolling';
import { useToast } from '../../components/Toast';
import { EmptyState, ErrorState, SkeletonRows } from '../../components/ui';

const minutes = (n: number | null) => (n === null ? '—' : `${n} min`);

/** Staff/admin console: pick a queue, call the next token, pause joins, watch the live line and today's stats. */
export default function StaffQueues() {
  useTitle('Service Queues');
  const notify = useToast();
  const queues = usePolling(() => api<{ queues: QueueSummary[] }>('/queues').then((r) => r.queues), 5000);
  const [selected, setSelected] = useState('');
  const current = selected || queues.data?.[0]?.id || '';
  const view = usePolling<StaffQueueView | null>(
    () => (current ? api<StaffQueueView>(`/queues/${current}`) : Promise.resolve(null)), 4000, [current],
  );
  const [busy, setBusy] = useState<'' | 'call' | 'pause'>('');
  const [bannerError, setBannerError] = useState('');

  useEffect(() => { setBannerError(''); }, [current]);

  const callNext = () => {
    setBusy('call');
    setBannerError('');
    api<StaffQueueView & { called: string | null; completed: boolean }>(`/queues/${current}/call-next`, { body: {} })
      .then((r) => {
        view.setData(r);
        if (r.called) notify(`Now serving ${r.called}`, r.serving ? `${r.serving.studentName}${r.serving.purpose ? ` · ${r.serving.purpose}` : ''}` : undefined);
        else notify(r.completed ? 'Last token completed' : 'No one is waiting', 'The queue is empty.');
        queues.reload();
      })
      .catch((e) => { setBannerError(errorMessage(e)); notify('Couldn’t call the next token', errorMessage(e), 'error'); })
      .finally(() => setBusy(''));
  };

  const togglePause = (paused: boolean) => {
    setBusy('pause');
    setBannerError('');
    api<StaffQueueView>(`/queues/${current}/toggle-pause`, { method: 'PATCH', body: { paused } })
      .then((r) => {
        view.setData(r);
        notify(paused ? 'Queue paused' : 'Queue resumed', paused ? 'Students can’t join until you resume. Waiting students keep their place.' : 'Students can join again.');
        queues.reload();
      })
      .catch((e) => { setBannerError(errorMessage(e)); notify('Couldn’t update the queue', errorMessage(e), 'error'); })
      .finally(() => setBusy(''));
  };

  if (!queues.data) {
    return (
      <div className="page"><div className="container" style={{ maxWidth: 1400 }}>
        <div className="panel">
          {queues.error
            ? <ErrorState title="Queues couldn’t be loaded" action={<button className="btn btn-secondary" onClick={() => queues.reload()}>Try again</button>}>{queues.error}</ErrorState>
            : <SkeletonRows rows={4} cols={4} />}
        </div>
      </div></div>
    );
  }

  const v = view.data && view.data.queue.id === current ? view.data : null;
  const s = v?.stats;

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 1400 }}>
        <div className="page-head">
          <div>
            <div className="eyebrow">Campus Queue Manager</div>
            <h1>Service Queues</h1>
            <p className="sub">Call students to the counter, pause joins, and keep an eye on today’s numbers. Updates live.</p>
          </div>
        </div>

        <section className="panel" style={{ marginBottom: 20 }}>
          <div className="tabs" role="tablist" aria-label="Select service queue" style={{ padding: '0 10px' }}>
            {queues.data.map((q) => (
              <button key={q.id} role="tab" aria-selected={q.id === current} className={`tab${q.id === current ? ' active' : ''}`} onClick={() => setSelected(q.id)}>
                {q.name} <span className="count">{q.waiting}</span>
              </button>
            ))}
          </div>
        </section>

        {bannerError && <div className="alert danger" role="alert" style={{ marginBottom: 16 }}><PauseCircle size={16} /><span>{bannerError}</span></div>}
        {view.error && <div className="alert warn" role="status" style={{ marginBottom: 16 }}><PauseCircle size={16} /><span>Live updates paused — {view.error}</span></div>}

        {!v || !s ? (
          <div className="panel"><SkeletonRows rows={5} cols={4} /></div>
        ) : (
          <div className="stack">
            <div className="metrics" aria-label="Queue statistics">
              <div className="metric"><div className="m-label">Now Serving</div><div className="m-value mono">{v.serving?.tokenNumber ?? '—'}</div><div className="m-foot">{v.queue.name}</div></div>
              <div className="metric"><div className="m-label">Total Served Today</div><div className="m-value">{s.servedToday}</div><div className="m-foot">{s.cancelledToday} cancelled today</div></div>
              <div className="metric"><div className="m-label">Currently Waiting</div><div className="m-value">{s.waiting}</div><div className="m-foot">{s.inProgress ? '1 at the counter' : 'Counter free'}</div></div>
              <div className="metric"><div className="m-label">Average Wait Time</div><div className="m-value">{minutes(s.avgWaitMinutes)}</div><div className="m-foot">Join to called, today</div></div>
              <div className="metric"><div className="m-label">Average Handling Time</div><div className="m-value">{minutes(s.avgHandlingMinutes)}</div><div className="m-foot">At the counter, today</div></div>
            </div>

            {v.queue.isPaused && (
              <div className="alert warn" role="status">
                <PauseCircle size={16} />
                <span><strong>This queue is paused.</strong> New students can’t join. You can still call students who are already waiting.</span>
              </div>
            )}

            <div className="grid-2">
              <section className="panel">
                <div className="panel-head">
                  <h2>Live queue</h2>
                  <span className="hint">{v.waiting.length} waiting</span>
                </div>
                {v.waiting.length === 0 ? (
                  <EmptyState icon={<Users size={20} />} title="No one is waiting">Students who join this queue appear here in order.</EmptyState>
                ) : (
                  <div className="table-wrap">
                    <table className="table responsive">
                      <thead>
                        <tr><th className="num">#</th><th>Token</th><th>Student</th><th>Needs</th><th>Joined</th></tr>
                      </thead>
                      <tbody>
                        {v.waiting.map((t, i) => (
                          <tr key={t.id}>
                            <td className="num" data-label="Position">{t.position}</td>
                            <td data-label="Token"><span className="mono primary-cell">{t.tokenNumber}</span>{i === 0 && <> <span className="badge new">Next</span></>}</td>
                            <td data-label="Student"><span className="primary-cell">{t.studentName}</span><div className="sub-cell mono">{t.studentNumber}</div></td>
                            <td data-label="Needs">{t.purpose ?? <span className="muted">—</span>}</td>
                            <td data-label="Joined" className="nowrap">{relativeTime(t.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
              <section className="panel">
                <div className="panel-head">
                  <h2>Queue controller</h2>
                  {v.queue.isPaused ? <span className="badge waiting">Paused</span> : <span className="badge resolved">Active</span>}
                </div>
                <div className="panel-body">
                  <div className="small muted">Now serving</div>
                  <div className="mono" style={{ fontSize: 40, fontWeight: 600, color: v.serving ? 'var(--brand)' : 'var(--muted)', lineHeight: 1.15 }} aria-live="polite">
                    {v.serving?.tokenNumber ?? '—'}
                  </div>
                  {v.serving ? (
                    <p className="small text-2" style={{ marginTop: 4 }}>
                      {v.serving.studentName} · <span className="mono">{v.serving.studentNumber}</span>
                      {v.serving.purpose && <><br />{v.serving.purpose}</>}
                      {v.serving.calledAt && <><br /><span className="muted">Called {relativeTime(v.serving.calledAt).toLowerCase()}</span></>}
                    </p>
                  ) : (
                    <p className="small muted" style={{ marginTop: 4 }}>No one at the counter.</p>
                  )}

                  <button
                    className="btn btn-primary btn-lg btn-block" style={{ marginTop: 16 }}
                    onClick={callNext} disabled={busy !== '' || (!v.serving && v.waiting.length === 0)}
                  >
                    <BellRing size={17} />
                    {busy === 'call' ? 'Calling…' : v.waiting.length === 0 && v.serving ? 'Complete current token' : 'Call Next Token'}
                  </button>
                  <p className="help" style={{ marginTop: 6 }}>
                    {v.waiting.length
                      ? `Marks ${v.serving?.tokenNumber ?? 'the current token'} as completed and calls ${v.waiting[0].tokenNumber}.`
                      : 'Nobody is waiting right now.'}
                  </p>

                  <div className="divider" style={{ margin: '16px 0' }} />
                  <label className="checkbox" style={{ justifyContent: 'space-between', width: '100%' }}>
                    <span className="row" style={{ gap: 6 }}>
                      {v.queue.isPaused ? <PauseCircle size={16} /> : <PlayCircle size={16} />}
                      <span><strong>{v.queue.isPaused ? 'Queue paused' : 'Accepting new students'}</strong></span>
                    </span>
                    <input
                      type="checkbox" role="switch" aria-checked={!v.queue.isPaused} aria-label="Accept new students"
                      checked={!v.queue.isPaused} disabled={busy !== ''}
                      onChange={(e) => togglePause(!e.target.checked)}
                    />
                  </label>
                  <p className="help" style={{ marginTop: 4 }}>{v.queue.location}</p>
                </div>
              </section>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
