import { useTitle } from '../../lib/hooks';
import { StudentQueues } from '../../components/StudentQueues';

export default function Queues() {
  useTitle('Campus Queues');
  return (
    <div className="page">
      <div className="container narrow">
        <div className="page-head">
          <div>
            <div className="eyebrow">Campus Queue Manager</div>
            <h1>Campus Queues</h1>
            <p className="sub">Take a token for a campus counter and wait wherever you like. Your place in line updates live.</p>
          </div>
        </div>
        <StudentQueues />
      </div>
    </div>
  );
}
