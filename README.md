# Campus Saathi

Student support portal prototype for Vindhya University. Students describe a problem in their own words, Campus Saathi suggests the right service, and staff work the resulting case .

## Project layout

```
campus-saathi/
├── frontend/   React + TypeScript web app (student, staff and admin portals)
│   └── src/data/   shared sample data: departments, students, staff, procedures (NOC)
├── backend/    Node + Express API: login sessions, role checks, cases, SQLite database
├── ml/         request classification: keyword model, AI model, dataset, evaluation
└── package.json  one install and one set of commands for all three
```

## Run it

```
npm install
npm run dev        # API on :3001 + web app on http://localhost:5173
npm run build      # type-check frontend and server, build into dist/
npm start          # API also serves the built app on http://localhost:3001
```

Requires Node 22.5+ (uses the built-in `node:sqlite`). The database is created and seeded at `data/campuscare.db` on first start.

## Demo access

Use the **Demo access** buttons on `/login`, or sign in with one of these addresses and the password `CampusSaathi2026`:

| Role    | Account                          | Lands on   |
|---------|-----------------------------------|------------|
| Student | a.reddy@student.vindhya.ac.in     | `/student` |
| Staff   | meera.iyer@vindhya.ac.in          | `/staff`   |
| Admin   | vikram.nair@vindhya.ac.in         | `/admin`   |

Routes are protected by role. Signed-out visitors go to `/login`; a signed-in user who opens another role's URL is sent to their own home.

## Campus Queue Manager (Vision2Web — Track 1, Problem 4)

A digital queue for high-demand campus counters. Students join a service queue, get a token number, see their live position and estimated wait, and can cancel. Staff call the next token, pause a queue, and see live statistics.

| Problem-statement feature | Where it lives |
| --- | --- |
| Service queues | `queues` table · `GET /api/queues` · Campus Queues page and Student Home section |
| Token generation | `POST /api/queues/:id/join` → formatted tokens such as `CERT-104`, generated inside a `BEGIN IMMEDIATE` transaction so two students can never get the same number |
| Live position | `GET /api/queues/my-tokens` → position, "now serving", and estimated wait (from today's real average handling time); the UI refreshes every 4–5 s |
| Cancel request | `POST /api/tokens/:id/cancel` → everyone behind moves up, with no gaps |
| Staff controls | `POST /api/queues/:id/call-next` (completes current, calls next) · `PATCH /api/queues/:id/toggle-pause` |
| Queue statistics | `GET /api/queues/:id/stats` → served today, waiting, average wait, average handling time, cancellations |

**Pages:** `/student/queues` (also a section on `/student`), `/staff/queues`, `/admin/queues`.

**Validation and security:** request params and bodies are validated with Zod. Role checks reuse `requireRole` (students join and cancel; staff and admins call and pause). A partial unique index (`queue_tokens_one_active`) guarantees one active token per student per queue at database level. Errors return 400/401/403/404/409 with friendly messages, shown as toasts and alert banners, e.g. "…is currently paused by staff".

**Demo data:** three queues (Certificate & Marksheet Counter, IT Helpdesk & Laptop Support, Robotics & Embedded Systems Lab Booking, which starts paused). Demo tokens include two for `a.reddy@student.vindhya.ac.in` (`CERT-106`, #3 in line, and `IT-202`, #1). Timestamps are relative to "now", so the stats always look like today. **Reset demo data** in the user menu (admin) re-seeds both cases and queues.

**Try it:** open a student window and a staff window side by side. Click **Call Next Token** as staff and watch the student's position drop within seconds.

### In-person procedures

`frontend/src/data/physicalProcedures.ts` adds five procedures that need office visits or physical sign-off: **Bonafide Certificate, Community Connect Verification, Library & No-Dues Clearance, Hostel Room Handover, and Medical Leave Verification**, alongside the existing NOC. When a student describes one of these on Find Support, they get the ordered office route and the documents to bring. Steps with a `queueId` (e.g. the Registry Certificates Counter) show **Join this counter's queue**, which issues a token with the procedure as its purpose, so staff can see what each student needs.

## Notes

- **Backend** (`backend/`): Express + SQLite. Sessions are httpOnly cookies; passwords are scrypt-hashed. Access is enforced server-side: students see only their own cases (without internal notes), staff only their department's, admins everything. Cross-site writes are rejected.
- Admins can restore the sample data from the user menu (**Reset demo data**).
- Environment: `PORT`, `DB_PATH`, `DEMO_PASSWORD`, `DEMO_LOGIN=off` (hides the demo shortcut), `NODE_ENV=production` (secure cookies).
- **AI triage** (`ml/ai-triage.ts`): Claude reads the student's full description and returns the service, category, urgency, a plain-English reason and 3–5 self-help steps tailored to the problem, as schema-validated JSON. To turn it on, copy `.env.example` to `.env`, set `ANTHROPIC_API_KEY`, and restart. Without a key — or if the API errors, rate-limits or declines — the keyword rules in `ml/triage.ts` are used instead. Crisis and personal-safety language is always escalated to High and shows emergency contacts first, whichever path runs. Set `AI_TRIAGE=off` to force the keyword rules, or `TRIAGE_MODEL` to change the model (default `claude-opus-5`).
- Styles: design tokens and components in `frontend/src/styles.css`, page layouts in `frontend/src/pages.css`.
- Dataset and evaluation: `npm run ml:evaluate`, `npm run ml:export` (see `ml/README.md`).
