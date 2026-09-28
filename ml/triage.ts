import type { Priority } from '../frontend/src/data/types';
import { PROCEDURES } from '../frontend/src/data/procedures';



interface Rule {
  dept: string;
  category: string;
  reason: string;
  urgency: Priority;
  terms: string[];
  steps: string[];
  /** Optional per-topic overrides: if any matched term falls in `match`, its steps replace the rule's
   * generic `steps` — so a query about mould gets mould advice, not the same 4 lines every query in
   * this category gets. Checked in order; first match wins. */
  topicSteps?: { match: string[]; steps: string[] }[];
  crisis?: boolean;
  safety?: boolean;
}

const RULES: Rule[] = [
  { dept: 'counselling', category: 'Urgent wellbeing concern', steps: ['If you feel you might act on these thoughts, call 112 or go to your nearest hospital emergency ward now.', 'Call the KIRAN Mental Health Helpline free on 1800-599-0019, any time, day or night.', 'WhatsApp or call iCall on 9152987821 if you’d rather not talk on the phone.', 'Stay with someone you trust, or tell them where you are and how you’re feeling.'], reason: 'thoughts of harming yourself', urgency: 'High', crisis: true,
    terms: ['suicid', 'kill myself', 'killing myself', 'end my life', 'ending my life', 'end it all', 'take my own life', 'taking my own life',
      'self-harm', 'self harm', 'self harming', 'hurt myself', 'hurting myself', 'harm myself', 'cut myself', 'cutting myself',
      'don’t want to be here', "don't want to be here", 'don’t want to live', "don't want to live", 'want to die', 'wish i was dead', 'wish i were dead',
      'no reason to live', 'not worth living', 'better off without me', 'better off dead'] },
  { dept: 'security', category: 'Personal safety', steps: ['If you’re in danger now, call 112, or Campus Security on +91 80 4021 1212.', 'Go to a busy, well-lit place or the Security Lodge at the Main Gate.', 'Use the free Safe Walk service after dark — call Security and an officer will walk with you.', 'Write down what happened, when and where, while it’s fresh.'], reason: 'your personal safety', urgency: 'High', safety: true,
    terms: ['assault', 'attacked', 'followed me', 'following me', 'unsafe', 'threaten', 'stalk', 'harass', 'spiking', 'spiked', 'stolen', 'theft', 'broke into', 'lost property'] },

  { dept: 'counselling', category: 'Exam stress', steps: ['Break revision into short 25–30 minute blocks with 5-minute breaks.', 'Plan your week on paper so you can see time for every exam.', 'Keep a regular sleep routine and limit caffeine after mid-afternoon.', 'Join a free drop-in Managing Exam Stress workshop — no booking needed.', 'Use past papers on Moodle to practise under timed conditions.'], reason: 'exam-related stress', urgency: 'Medium',
    terms: ['exam', 'revision', 'revise', 'stress', 'overwhelm', 'pressure', 'can’t cope', "can't cope", 'cope', 'panic'] },
  { dept: 'counselling', category: 'Anxiety and low mood', steps: ['Try the free Togetherall online support community — sign in with your university account.', 'Work through a guided self-help course on the Wellbeing page.', 'Get outside, move and eat regularly — small routines help more than you’d expect.', 'Talk to a friend, flatmate or your personal tutor about how you’re feeling.', 'Join a society or peer support group listed on the Student Hub.'], reason: 'how you’ve been feeling', urgency: 'Medium',
    terms: ['anxious', 'anxiety', 'depress', 'low mood', 'feeling low', 'lonely', 'homesick', 'sad', 'not sleeping', 'can’t sleep', "can't sleep", 'crying', 'mental health', 'counsell', 'therapy', 'talk to someone'] },
  { dept: 'counselling', category: 'Bereavement', steps: ['Email your personal tutor — they can tell your lecturers so you aren’t chased about deadlines.', 'Apply for a self-certified 7-day extension on Moodle for any work due soon.', 'Read the bereavement support guide on the Wellbeing page.', 'Call the Vandrevala Foundation Helpline free on 1860-2662-345 for bereavement support, any time.'], reason: 'a bereavement', urgency: 'High',
    terms: ['passed away', 'died', 'death', 'funeral', 'bereave', 'grief'] },

  { dept: 'advising', category: 'Extensions', steps: ['Check the deadline rules in your module handbook on Moodle.', 'For up to 7 days, submit a self-certified extension form on the module’s Moodle page — no evidence needed.', 'Email your module leader straight away to let them know.', 'Keep working on what you can so you’re ready for the new date.'], reason: 'a coursework deadline or extension', urgency: 'Medium',
    terms: ['extension', 'deadline', 'coursework', 'assignment', 'late submission', 'submit'] },
  { dept: 'advising', category: 'Extenuating circumstances', steps: ['Read the Extenuating Circumstances policy on the Student Hub.', 'Collect evidence, such as a letter from a doctor, counsellor or other professional.', 'Complete the online EC form yourself from the Student Hub page.', 'Submit it before the panel deadline for your assessment period.'], reason: 'circumstances affecting your assessments', urgency: 'Medium',
    terms: ['extenuating', 'mitigating', 'missed an exam', 'missed my exam', 'resit', 'failed', 'progression', 'repeat the year', 'interrupt', 'withdraw from', 'change module', 'change my course', 'switch course', 'transfer course'] },

  { dept: 'registry', category: 'Letters and records', steps: ['Download bank KYC and proof-of-study letters instantly from the Documents section of the portal.', 'Update your address or phone number yourself in the Student Record section.', 'Order an official transcript online through the Registry page.', 'Replacement ID cards can be ordered and paid for in the online store.'], reason: 'an official letter or your student record', urgency: 'Low',
    terms: ['kyc', 'address proof', 'transcript', 'certificate', 'enrolment', 'enrollment', 'enrol', 'student record', 'id card', 'student card', 'proof of study', 'status letter', 'change my name', 'graduation'] },

  { dept: 'finance', category: 'Fees and payments', steps: ['Check your balance, invoices and payments in the Payments section of the portal.', 'Set up an instalment plan yourself in the portal under Payment Options.', 'If you’re waiting for an education loan, check the status with your bank’s loan cell.', 'NEFT/RTGS transfers can take up to 5 working days — keep your receipt and UTR number.'], reason: 'tuition fees or payments', urgency: 'Medium',
    terms: ['tuition', 'fee', 'invoice', 'instalment', 'installment', 'payment plan', 'refund', 'sponsor', 'education loan', 'student loan', 'loan hasn', 'loan payment', 'bank loan'] },

  { dept: 'aid', category: 'Financial hardship', steps: ['Use the budgeting calculator on the Money Advice page to see your shortfall.', 'Pick up free food from the Student Union pantry (Mon–Fri, 12–2 pm) — no questions asked.', 'Apply online for the Hardship Fund using the form on the Money Advice page.', 'Check whether you’re eligible for the Vindhya Merit Scholarship using the online checker.'], reason: 'financial difficulty', urgency: 'Medium',
    terms: ['hardship', 'bursary', 'scholarship', 'can’t afford', "can't afford", 'afford food', 'no money', 'out of money', 'money', 'hostel fees due', 'struggling financially', 'food bank', 'grant'] },

  { dept: 'accommodation', category: 'Halls and housing', reason: 'your accommodation', urgency: 'Medium',
    steps: ['Report it in the online Maintenance Portal — most repairs are fixed within 3 days.', 'For anything urgent (leak, gas smell, no power), call Ganga Hostel Reception (24 hours) on +91 80 4021 1206.', 'Check with your floor for a similar issue — it may already be reported as a building-wide fault.', 'The Floor Caretaker can often help on the spot for small issues.'],
    topicSteps: [
      { match: ['mould', 'mold', 'damp'], steps: ['Wipe visible mould with a mould-and-mildew spray and dry the area with a cloth.', 'Open your window for at least an hour a day to let the room air out.', 'Keep furniture and mattresses a few inches away from damp walls.', 'Report it in the Maintenance Portal if it comes back — recurring mould needs a proper inspection.'] },
      { match: ['heating', 'heater', 'boiler', 'ac', 'a/c', 'air con', 'aircon', 'air-con', 'air conditioner', 'air conditioning', 'cooling', 'fan'], steps: ['Check the unit’s plug and switch — many trip on the room’s circuit breaker after a power cut.', 'Report it in the online Maintenance Portal — most repairs are completed within 3 days.', 'If it’s out across your whole floor, it’s likely a building fault — call Ganga Hostel Reception.', 'While you wait, use extra blankets or keep windows closed to manage the temperature.'] },
      { match: ['leak', 'water', 'hot water', 'shower', 'toilet', 'sink', 'tap', 'plumbing', 'drain', 'blocked', 'geyser'], steps: ['For a blocked drain, try a plunger before reporting it — it clears most simple blockages.', 'Check the geyser’s power switch is on if there’s no hot water.', 'If there’s an active leak, call Ganga Hostel Reception (24 hours) on +91 80 4021 1206 straight away.', 'Report non-urgent plumbing issues in the online Maintenance Portal.'] },
      { match: ['roommate', 'roomate', 'roomie', 'roomies', 'noise'], steps: ['Try talking to your roommate directly first — most conflicts are sorted with a calm conversation.', 'Agree on quiet hours together, especially before exams.', 'If it continues, ask the Floor Caretaker or Hostel Warden to mediate.', 'Report repeated or serious issues to Residential Life so it’s on record.'] },
      { match: ['electricity', 'power cut', 'socket', 'plug', 'light', 'bulb'], steps: ['Check the room’s switchboard — a tripped MCB switch is the most common cause of a local power cut.', 'For a blown bulb or faulty socket, note your room number and report it in the Maintenance Portal.', 'If the whole floor has no power, it’s a building fault — call Ganga Hostel Reception.', 'Don’t attempt any wiring repair yourself — always report electrical faults to Maintenance.'] },
      { match: ['pest', 'cockroach', 'rat', 'mice', 'bed bugs', 'insects'], steps: ['Keep food sealed and bins emptied — this is the single biggest reason pests return.', 'Report it in the Maintenance Portal so pest control can be scheduled for your room.', 'For bed bugs, ask Housekeeping for a mattress inspection rather than treating it yourself.', 'Let your roommate know too, so both beds can be checked at the same time.'] },
      { match: ['window', 'door', 'lock', 'room key'], steps: ['If you’re locked out, the Floor Caretaker can let you in with a master key during the day.', 'After hours, call Ganga Hostel Reception (24 hours) on +91 80 4021 1206 for emergency access.', 'Report a broken lock or window latch in the Maintenance Portal — don’t leave it unsecured overnight.', 'Lost your room key? Order a replacement through the Warden Office.'] },
      { match: ['deposit', 'landlord'], steps: ['Check your rental agreement for what the deposit can and can’t be deducted for.', 'Take dated photos of the property’s condition if you haven’t already.', 'Email your landlord in writing rather than only calling — it creates a record.', 'If you can’t resolve it directly, Residential Life can advise on next steps for private housing.'] },
    ],
    terms: ['hall', 'flat', 'room', 'mould', 'mold', 'damp', 'heating', 'heater', 'boiler', 'leak', 'repair', 'maintenance', 'roommate', 'roomate', 'roomie', 'roomies', 'noise', 'landlord', 'deposit', 'accommodation', 'housing', 'ganga hostel', 'yamuna hostel',
      'hostel', 'dorm', 'residence', 'warden', 'ac', 'a/c', 'air con', 'aircon', 'air-con', 'air conditioner', 'air conditioning', 'cooling', 'fan', 'light', 'bulb', 'electricity', 'power cut', 'socket', 'plug', 'water', 'hot water', 'shower', 'toilet', 'sink', 'tap', 'plumbing', 'drain', 'blocked', 'geyser', 'window', 'door', 'lock', 'room key', 'bed', 'mattress', 'furniture', 'wardrobe', 'fridge', 'kitchen', 'laundry', 'washing machine', 'cleaning', 'pest', 'cockroach', 'rat', 'mice', 'bed bugs', 'insects'] },

  { dept: 'it', category: 'IT and accounts', reason: 'access to university IT systems', urgency: 'Medium',
    steps: ['Reset your password yourself at account.vindhya.ac.in.', 'If Moodle or Outlook won’t load, clear your browser cache or try a private window.', 'Download course software free from the Software Hub with your university login.', 'Visit the IT Service Desk (Library, Ground Floor) if you’re still stuck.'],
    topicSteps: [
      { match: ['password', 'log in', 'login', 'sign in', 'locked out', 'account locked', 'mfa', 'authenticator'], steps: ['Reset your password yourself at account.vindhya.ac.in.', 'If you’re locked out after too many attempts, wait 15 minutes before trying again.', 'Lost your authenticator app? Visit the IT Service Desk in person with your ID card to reset MFA.', 'Make sure caps lock isn’t on — it’s the most common reason a correct password fails.'] },
      { match: ['wifi', 'wi-fi', 'eduroam'], steps: ['Remove the old eduroam profile from your device’s Wi-Fi settings.', 'Reinstall it using the geteduroam app and sign in with your full university email.', 'Restart your device’s Wi-Fi adapter if it still won’t connect.', 'Still stuck? Visit the IT Service Desk with your device.'] },
      { match: ['moodle', 'outlook', 'email not', 'teams'], steps: ['Clear your browser cache or try a private/incognito window.', 'Check the Student Portal for any scheduled maintenance on that service.', 'If a specific module is missing from Moodle, it may just need an enrolment sync — report it and it’s usually fixed the same day.', 'Try a different browser if the page won’t load at all.'] },
      { match: ['software', 'licence', 'license'], steps: ['Check the Software Hub first — most course software is free to download with your university login.', 'Confirm which module the software is needed for when you report it, so the right licence gets assigned.', 'Some software is only available on campus lab machines — check the module handbook.', 'Report it if the download link doesn’t work — licences are usually assigned within a day.'] },
      { match: ['laptop', 'keyboard', 'charger', 'screen'], steps: ['For a hardware fault on a personally owned device, campus IT can advise but may not repair it directly.', 'Check whether it’s covered under manufacturer warranty first.', 'University-owned lab equipment faults should be reported immediately so it can be swapped.', 'Visit the IT Service Desk (Library, Ground Floor) for a hands-on look.'] },
      { match: ['printing', 'printer'], steps: ['Check your printing credit balance in the Student Portal first.', 'Try a different printer on the same floor — a single printer being down is common.', 'Make sure your document is a supported format (PDF prints most reliably).', 'Report a printer that’s been down for more than a day.'] },
      { match: ['vpn'], steps: ['Download the VPN client from the Software Hub.', 'Sign in with your full university email and password.', 'VPN is only needed for off-campus access to some restricted resources — check if you actually need it.', 'Report it if the client won’t connect at all.'] },
    ],
    terms: ['password', 'log in', 'login', 'sign in', 'locked out', 'account locked', 'mfa', 'authenticator', 'wifi', 'wi-fi', 'eduroam', 'moodle', 'outlook', 'email not', 'teams', 'software', 'licence', 'license', 'laptop', 'keyboard', 'charger', 'screen', 'printing', 'printer', 'vpn'] },

  { dept: 'library', category: 'Library', steps: ['Check your loans, renew books and see fines in My Library Account.', 'If you returned a book that’s still showing, use the “Report a return” link in your account.', 'Sign in through Library Search to get full access to e-books and journals off campus.', 'Book study rooms online on the Library website.'], reason: 'library services', urgency: 'Low',
    terms: ['library', 'book', 'overdue', 'library fine', 'borrow', 'journal', 'article', 'inter-library', 'study room', 'referencing', 'e-resource'] },

  { dept: 'disability', category: 'Adjustments and access', steps: ['Apply for Disabled Students’ Allowance directly through Student Finance.', 'Download free assistive software, such as Read&Write, from the Software Hub.', 'Use the Accessibility Map to find step-free routes and quiet study spaces.', 'Gather any evidence you have, such as a diagnostic report — you’ll need it for a support plan.'], reason: 'support for a disability or learning difference', urgency: 'Medium',
    terms: ['dyslexi', 'dyspraxi', 'adhd', 'autis', 'disab', 'wheelchair', 'extra time', 'reasonable adjustment', 'support plan', 'pwd scholarship', 'divyang', 'accessib', 'chronic', 'condition', 'hearing', 'visual impair'] },

  { dept: 'international', category: 'Visa and immigration', steps: ['Check the expiry date on your visa and your current course end date.', 'Read the visa guidance on the International Student Office page.', 'Download attendance and enrolment letters yourself from the Documents section of the portal.', 'Don’t travel or make any FRRO application until you’ve checked the guidance.'], reason: 'your visa or immigration status', urgency: 'Medium',
    terms: ['visa', 'frro', 'residential permit', 'e-visa', 'evisa', 'immigration', 'international student', 'attendance warning', 'embassy', 'passport', 'sponsor licence'] },

  { dept: 'careers', category: 'Careers and placements', steps: ['Browse jobs and placements on the Careers portal.', 'Build or improve your CV with the online CV builder.', 'Practise interviews with the free Shortlist.Me video tool.', 'Come to a daily drop-in (12–2 pm, Student Hub) for quick questions.'], reason: 'careers or placements', urgency: 'Low',
    terms: ['cv', 'placement', 'internship', 'job', 'career', 'interview', 'graduate scheme', 'cover letter', 'employ', 'part-time work'] },
];

const URGENT_WORDS = ['urgent', 'asap', 'emergency', 'today', 'tonight', 'immediately', 'evict', 'right now', 'getting worse'];

const patternCache = new Map<string, RegExp>();
function termPattern(term: string) {
  let re = patternCache.get(term);
  if (!re) {
    const t = term.replace(/['’]/g, '’').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    re = new RegExp(term.length <= 4 ? `\\b${t}s?\\b` : `\\b${t}`);
    patternCache.set(term, re);
  }
  return re;
}

/** Edit distance between two words — used to catch typos the exact keyword pass misses. */
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = a[i - 1] === b[j - 1] ? prev[j - 1] : 1 + Math.min(prev[j - 1], prev[j], cur[j - 1]);
    }
    prev = cur;
  }
  return prev[b.length];
}

const fuzzyBudget = (len: number) => (len <= 5 ? 1 : 2);

/** Single-word terms only — a misspelled word within a few edits of a known term counts as a hit.
 * Terms under 5 letters are skipped (too many unrelated words sit within one edit at that length),
 * and the first letter must match — real typos almost never change the word's opening letter, and
 * requiring it rules out coincidental near-neighbours like "right"/"light" or "letter"/"heater". */
function fuzzyHits(words: string[], terms: string[]): string[] {
  const hits: string[] = [];
  for (const term of terms) {
    if (term.includes(' ') || term.length < 5) continue;
    const found = words.some((w) =>
      w.length >= 5 && w[0] === term[0] &&
      Math.abs(w.length - term.length) <= fuzzyBudget(term.length) && levenshtein(w, term) <= fuzzyBudget(term.length));
    if (found) hits.push(term);
  }
  return hits;
}

export interface TriageMatch {
  dept: string;
  category: string;
  reason: string;
  urgency: Priority;
  confidence: number;
  signals: string[];
  steps: string[];
  procedureId?: string;
  crisis: boolean;
  safety: boolean;
}

export interface TriageResult {
  best: TriageMatch | null;
  alternatives: TriageMatch[];
}

export function triage(input: string): TriageResult {
  const text = ` ${input.toLowerCase().replace(/['’]/g, '’').replace(/\s+/g, ' ')} `;
  let scored = RULES.map((rule) => {
    const terms = [...new Set(rule.terms.map((t) => t.replace(/'/g, '’')))];
    const hits = terms.filter((t) => termPattern(t).test(text));
    const weight = hits.length * (rule.crisis ? 10 : rule.safety ? 3 : 1);
    return { rule, hits, weight };
  }).filter((s) => s.weight > 0);

  scored.sort((a, b) => b.weight - a.weight);

  const urgentRisk = scored.some((x) => x.rule.crisis || x.rule.safety);
  const proc = urgentRisk ? undefined : PROCEDURES.find((p) => p.terms.some((t) => termPattern(t).test(text)));
  if (proc) {
    return {
      best: {
        dept: proc.department, category: proc.category, reason: proc.reason, urgency: 'Medium', confidence: 0.95,
        signals: proc.terms.filter((t) => termPattern(t).test(text)), steps: [], procedureId: proc.id, crisis: false, safety: false,
      },
      alternatives: [],
    };
  }

  // Nothing matched literally — retry with typo-tolerant matching before giving up.
  let fuzzy = false;
  if (scored.length === 0) {
    const words = text.split(/[^a-z0-9’'-]+/).filter(Boolean);
    fuzzy = true;
    scored = RULES.map((rule) => {
      const terms = [...new Set(rule.terms.map((t) => t.replace(/'/g, '’')))];
      const hits = fuzzyHits(words, terms);
      const weight = hits.length * (rule.crisis ? 10 : rule.safety ? 3 : 1);
      return { rule, hits, weight };
    }).filter((s) => s.weight > 0);
    scored.sort((a, b) => b.weight - a.weight);
  }
  if (scored.length === 0) return { best: null, alternatives: [] };

  const urgentBoost = URGENT_WORDS.some((w) => termPattern(w).test(text));
  const stepsFor = (rule: Rule, hits: string[]): string[] =>
    rule.topicSteps?.find((t) => t.match.some((m) => hits.includes(m)))?.steps ?? rule.steps;
  const toMatch = (s: (typeof scored)[number]): TriageMatch => {
    let urgency = s.rule.urgency;
    if (urgentBoost && urgency !== 'High') urgency = urgency === 'Low' ? 'Medium' : 'High';
    return {
      dept: s.rule.dept,
      category: s.rule.category,
      reason: `Your request appears related to ${s.rule.reason}.`,
      urgency,
      confidence: fuzzy ? Math.min(0.7, 0.45 + s.hits.length * 0.1) : Math.min(0.96, 0.58 + s.hits.length * 0.12),
      signals: fuzzy ? s.hits : s.hits.map((h) => text.match(new RegExp(`${termPattern(h).source}[\\w’-]*`))?.[0] ?? h),
      steps: stepsFor(s.rule, s.hits),
      crisis: !!s.rule.crisis,
      safety: !!s.rule.safety,
    };
  };

  const best = toMatch(scored[0]);
  const seen = new Set([best.dept]);
  const alternatives: TriageMatch[] = [];
  for (const s of scored.slice(1)) {
    if (seen.has(s.rule.dept)) continue;
    seen.add(s.rule.dept);
    alternatives.push(toMatch(s));
    if (alternatives.length === 2) break;
  }
  return { best, alternatives };
}

export function titleFrom(text: string, category: string) {
  const first = text.trim().split(/(?<=[.!?])\s/)[0].replace(/[.!?]+$/, '');
  if (first.length >= 12 && first.length <= 70) return first.charAt(0).toUpperCase() + first.slice(1);
  if (first.length > 70) return first.slice(0, 67).replace(/\s+\S*$/, '') + '…';
  return `${category} request`;
}
