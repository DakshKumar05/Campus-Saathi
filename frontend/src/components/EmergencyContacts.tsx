import { Phone, ShieldAlert } from 'lucide-react';

export const EMERGENCY_CONTACTS = [
  { name: 'Emergency services', detail: 'Police, ambulance or fire — if someone is in immediate danger', phone: '112' },
  { name: 'Campus Security (24 hours)', detail: 'Incidents on campus or in university hostels', phone: '+91 80 4021 1212' },
  { name: 'KIRAN Mental Health Helpline (24 hours)', detail: 'Free, confidential support if you’re struggling to cope', phone: '1800-599-0019' },
  { name: 'Ambulance', detail: 'Urgent medical advice when it isn’t police or fire', phone: '108' },
  { name: 'Out-of-hours Wellbeing Line', detail: 'Evenings, weekends and public holidays', phone: '+91 80 4021 1200' },
];

export function EmergencyContacts({ compact }: { compact?: boolean }) {
  const list = compact ? EMERGENCY_CONTACTS.slice(0, 3) : EMERGENCY_CONTACTS;
  return (
    <ul className="list">
      {list.map((c) => (
        <li key={c.name}>
          <a className="list-link" href={`tel:${c.phone.replace(/\s/g, '')}`}>
            <span className={`icon-box${c.phone === '112' ? ' danger' : ''}`}>
              {c.phone === '112' ? <ShieldAlert size={18} /> : <Phone size={18} />}
            </span>
            <span className="ll-main">
              <span className="ll-title" style={{ display: 'block' }}>{c.name}</span>
              <span className="ll-sub" style={{ display: 'block' }}>{c.detail}</span>
            </span>
            <span className="mono" style={{ fontWeight: 600, color: 'var(--text)' }}>{c.phone}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
