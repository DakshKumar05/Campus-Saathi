import type { Procedure } from './procedures';

// In-person procedures: physical documents, office visits or multi-department sign-off.
// Rooms and signatories are demo values — replace them with your campus's real offices.
// A step with a `queueId` lets the student join that counter's live queue from Find Support.
export const PHYSICAL_PROCEDURES: Procedure[] = [
  {
    id: 'bonafide-certificate',
    title: 'Bonafide Certificate',
    department: 'registry',
    category: 'Letters and records',
    reason: 'Your request appears related to getting a bonafide certificate, which needs in-person verification and a signed, sealed original from the Registry.',
    terms: [
      'bonafide', 'bona fide', 'bona-fide', 'study certificate', 'proof of enrollment', 'proof of enrolment',
      'certificate for bank', 'certificate for passport', 'scholarship certificate', 'enrollment proof',
    ],
    documents: [
      'Student ID card (original)',
      'Completed bonafide request form (available at the Registry counter)',
      'Fee receipt for the current semester (photocopy)',
      'Format letter from the requesting body, if they need a specific format (e.g. bank, passport office)',
    ],
    steps: [
      { who: 'Department Office Clerk', where: 'Department Office, Ground Floor, your Academic Block', what: 'Get the request form verified and stamped with the department seal.' },
      { who: 'Head of Department (HOD)', where: 'Room A-101, Administrative Block', what: 'Get the HOD’s signature on the verified form.' },
      { who: 'Registry — Certificates Counter', where: 'Counter 2, Registry, Administrative Block', what: 'Submit the signed form with your ID and fee receipt, and collect an acknowledgement slip.', queueId: 'certificates' },
    ],
    turnaround: 'within 2 working days',
    collect: { title: 'Collect your bonafide certificate', note: 'bring your acknowledgement slip back to Counter 2.' },
  },
  {
    id: 'community-connect',
    title: 'Community Connect Verification',
    department: 'advising',
    category: 'Community Connect',
    reason: 'Your request appears related to verifying your Community Connect hours, which needs your physical logbook signed by the host organisation and your faculty coordinator.',
    terms: [
      'community connect', 'community-connect', 'community service hours', 'community service logbook',
      'cc logbook', 'social internship', 'nss hours', 'outreach hours', 'field work logbook',
    ],
    documents: [
      'Community Connect logbook with daily entries (original)',
      'Attendance / completion letter from the host organisation or NGO on their letterhead',
      'Geo-tagged photos or activity report (printed)',
      'Student ID card',
    ],
    steps: [
      { who: 'Host Organisation Supervisor', where: 'Your placement site / NGO office', what: 'Get every logbook page signed and the completion letter issued.' },
      { who: 'Faculty Supervisor (Community Connect)', where: 'Room B-105, Academic Block B', what: 'Get the logbook stamped and signed, and your hours verified.' },
      { who: 'Department Office', where: 'Department Office, Ground Floor, your Academic Block', what: 'Submit the verified logbook so your credits are entered on your record.' },
      { who: 'Registry — Certificates Counter', where: 'Counter 2, Registry, Administrative Block', what: 'Collect your Community Connect completion certificate.', queueId: 'certificates' },
    ],
    turnaround: 'within 5 working days',
    collect: { title: 'Credits added to your record', note: 'you’ll see Community Connect marked complete on your transcript.' },
  },
  {
    id: 'library-no-dues',
    title: 'Library & No-Dues Clearance',
    department: 'finance',
    category: 'No-dues clearance',
    reason: 'Your request appears related to library or no-dues clearance, which needs you to return physical items and collect stamps from several offices before Finance can clear you.',
    terms: [
      'no dues', 'no-dues', 'library clearance', 'clearance certificate', 'clearance form', 'return library books',
      'library fine', 'final semester clearance', 'leaving college clearance', 'tc clearance', 'transfer certificate',
    ],
    documents: [
      'No-dues clearance form (collect from the Accounts Office)',
      'All borrowed library books and your library card',
      'Student ID card (original)',
      'Receipts for any fines already paid',
    ],
    steps: [
      { who: 'Central Library — Circulation Desk', where: 'Ground Floor, Central Library', what: 'Return all books and your library card, pay any fine, and get the form stamped.' },
      { who: 'Department Lab In-charge', where: 'Lab Office, your Academic Block', what: 'Confirm there are no lab equipment or breakage dues and get the form signed.' },
      { who: 'Hostel Warden (hostel residents only)', where: 'Warden Office, your Hostel Block', what: 'Get the hostel dues clearance signature.' },
      { who: 'Accounts Officer', where: 'Accounts Counter, Administrative Block, First Floor', what: 'Submit the fully stamped form so Accounts can check your fee record.' },
    ],
    turnaround: 'within 5 working days',
    collect: { title: 'Collect your no-dues certificate', note: 'the Accounts Office will email you when it’s ready.' },
  },
  {
    id: 'hostel-room-handover',
    title: 'Hostel Room Handover',
    department: 'accommodation',
    category: 'Room handover',
    reason: 'Your request appears related to vacating or handing over your hostel room, which needs a physical room inspection and return of keys before your deposit is refunded.',
    terms: [
      'hostel checkout', 'hostel check-out', 'room handover', 'hand over my room', 'vacate hostel', 'vacating hostel',
      'vacate my room', 'vacating my room', 'return hostel keys', 'return my keys', 'room inspection', 'caution deposit', 'hostel deposit refund',
    ],
    documents: [
      'Hostel ID card',
      'Room keys and any issued furniture or inventory items',
      'Hostel vacating form (available at the Warden Office)',
      'Bank details for the caution deposit refund (cancelled cheque or passbook copy)',
    ],
    steps: [
      { who: 'Floor Caretaker', where: 'Your hostel room', what: 'Room inspection against the inventory list — the caretaker signs the form and notes any damage.' },
      { who: 'Hostel Warden', where: 'Warden Office, your Hostel Block', what: 'Hand over your keys and hostel ID; the warden signs and stamps the form.' },
      { who: 'Mess Manager', where: 'Mess Office, Central Dining Hall', what: 'Confirm there are no pending mess dues and get the form signed.' },
      { who: 'Accommodation Office', where: 'Room A-110, Administrative Block', what: 'Submit the completed form and bank details to start your deposit refund.' },
    ],
    turnaround: 'within 10 working days',
    collect: { title: 'Deposit refunded', note: 'the caution deposit is paid to the bank account you gave, minus any damage charges.' },
  },
  {
    id: 'medical-leave-verification',
    title: 'Medical Leave Verification',
    department: 'advising',
    category: 'Medical leave',
    reason: 'Your request appears related to medical leave or attendance condonation, which needs your original medical documents verified in person by the campus medical officer and your department.',
    terms: [
      'medical leave', 'sick note', 'sick leave', 'medical certificate', 'attendance shortage', 'short attendance',
      'condonation', 'attendance condonation', 'medical attendance',
    ],
    documents: [
      'Original medical certificate from a registered medical practitioner',
      'Prescriptions, test reports or discharge summary (originals and photocopies)',
      'Completed medical leave application form',
      'Student ID card (original)',
    ],
    steps: [
      { who: 'Campus Medical Officer', where: 'Health Centre, near Main Gate', what: 'Get your medical certificate verified and countersigned.' },
      { who: 'Class Advisor', where: 'Faculty cabin, your Academic Block', what: 'Submit the countersigned application so the leave dates are recorded against your attendance.' },
      { who: 'Head of Department (HOD)', where: 'Room A-101, Administrative Block', what: 'Get HOD approval for attendance condonation.' },
    ],
    turnaround: 'within 3 working days',
    collect: { title: 'Attendance updated', note: 'the approved leave will show in your attendance record.' },
  },
];
