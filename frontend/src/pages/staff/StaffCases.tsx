import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useCases } from '../../data/CaseStore';
import { departmentById, staffById, studentById } from '../../data/directory';
import type { Case } from '../../data/types';
import { useDataLoading, useTitle } from '../../lib/hooks';
import { CaseTable } from '../../components/CaseTable';
import { EmptyState, SkeletonRows } from '../../components/ui';
import { useToast } from '../../components/Toast';
import { errorMessage } from '../../lib/api';

type View = 'unassigned' | 'mine' | 'team' | 'everyone';

const FILTERS: { key: string; label: string; test: (c: Case) => boolean }[] = [
  { key: 'open', label: 'Open', test: (c) => c.status !== 'Resolved' },
  { key: 'high', label: 'High Priority', test: (c) => c.status !== 'Resolved' && c.priority === 'High' },
  { key: 'new', label: 'New', test: (c) => c.status === 'New' },
  { key: 'progress', label: 'In Progress', test: (c) => c.status === 'In Progress' },
  { key: 'waiting', label: 'Waiting', test: (c) => c.status === 'Waiting' },
  { key: 'resolved', label: 'Resolved', test: (c) => c.status === 'Resolved' },
];

function matches(c: Case, q: string) {
  if (!q) return true;
  const s = studentById(c.studentId);
  return [c.id, c.title, c.category, s?.name, s?.studentNumber].some((v) => v?.toLowerCase().includes(q));
}

export default function StaffCases() {
  useTitle('Cases');
  const { user } = useAuth();
  const { cases, updateCase } = useCases();
  const notify = useToast();
  const loading = useDataLoading();
  const me = staffById(user!.id)!;
  const dept = departmentById(me.departmentId)!;

  const team = useMemo(() => cases.filter((c) => c.departmentId === me.departmentId), [cases, me]);
  const unassignedOpen = team.filter((c) => !c.assigneeId && c.status !== 'Resolved');
  const [view, setView] = useState<View>(unassignedOpen.length > 0 ? 'unassigned' : 'mine');
  const [filter, setFilter] = useState('open');
  const [q, setQ] = useState('');

  const VIEWS: { key: View; label: string; count: number }[] = [
    { key: 'unassigned', label: 'Unassigned', count: unassignedOpen.length },
    { key: 'mine', label: 'Assigned to me', count: team.filter((c) => c.assigneeId === me.id && c.status !== 'Resolved').length },
    { key: 'team', label: 'My team', count: team.filter((c) => c.status !== 'Resolved').length },
    { key: 'everyone', label: 'All requests', count: cases.filter((c) => c.status !== 'Resolved').length },
  ];

  const base = view === 'everyone' ? cases
    : team.filter((c) => (view === 'unassigned' ? !c.assigneeId : view === 'mine' ? c.assigneeId === me.id : true));
  const active = FILTERS.find((f) => f.key === filter)!;
  const term = q.trim().toLowerCase();
  const rows = base.filter((c) => active.test(c) && matches(c, term));

  const takeCase = (c: Case) => {
    updateCase(c.id, { assigneeId: me.id, ...(c.status === 'New' ? { status: 'In Progress' as const } : {}) })
      .then(() => notify(`${c.id} assigned to you`, c.title))
      .catch((e) => notify('Couldn’t assign this case', errorMessage(e), 'error'));
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 1400 }}>
        <div className="page-head">
          <div>
            <div className="eyebrow">{dept.team}</div>
            <h1>Cases</h1>
            <p className="sub">
              {dept.name} · {unassignedOpen.length} waiting to be picked up
            </p>
          </div>
          <div className="row" role="group" aria-label="Which cases">
            {VIEWS.map((v) => (
              <button key={v.key} className={`btn btn-sm ${view === v.key ? 'btn-primary' : 'btn-secondary'}`} aria-pressed={view === v.key} onClick={() => setView(v.key)}>
                {v.label} <span className="mono">{v.count}</span>
              </button>
            ))}
          </div>
        </div>

        <section className="panel">
          <div className="tabs" role="tablist" style={{ padding: '0 10px' }}>
            {FILTERS.map((f) => (
              <button key={f.key} role="tab" aria-selected={filter === f.key} className={`tab${filter === f.key ? ' active' : ''}`} onClick={() => setFilter(f.key)}>
                {f.label} <span className="count">{base.filter(f.test).length}</span>
              </button>
            ))}
          </div>
          <div className="toolbar">
            <div className="input-icon">
              <Search size={16} />
              <input className="input sm" placeholder="Search by case, student or keyword" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search cases" />
            </div>
            <span className="small muted">{rows.length} case{rows.length === 1 ? '' : 's'}</span>
          </div>
          {loading ? <SkeletonRows rows={6} cols={6} /> : (
            <CaseTable
              cases={rows}
              basePath="/staff/cases"
              initialSort="priority"
              columns={view === 'everyone'
                ? ['id', 'student', 'title', 'department', 'priority', 'status', 'updated']
                : ['id', 'student', 'title', 'priority', 'status', 'assignee', 'updated']}
              rowAction={(c) => (!c.assigneeId && c.status !== 'Resolved' && c.departmentId === me.departmentId
                ? <button className="btn btn-secondary btn-sm" onClick={() => takeCase(c)}>Assign to me</button>
                : null)}
              empty={
                <EmptyState title={term ? 'No cases match your search' : 'Nothing here'}>
                  {term ? 'Try a case number, student name or student ID.'
                    : view === 'unassigned' ? 'Every open case in your team has someone on it.'
                    : view === 'mine' ? 'No cases assigned to you. Check Unassigned to pick one up.'
                    : 'Cases will appear here when they match this filter.'}
                </EmptyState>
              }
            />
          )}
        </section>
      </div>
    </div>
  );
}
