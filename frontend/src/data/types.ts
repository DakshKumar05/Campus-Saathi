export type Role = 'student' | 'staff' | 'admin';
export type Status = 'New' | 'In Progress' | 'Waiting' | 'Resolved';
export type Priority = 'High' | 'Medium' | 'Low';

export const STATUSES: Status[] = ['New', 'In Progress', 'Waiting', 'Resolved'];
export const PRIORITIES: Priority[] = ['High', 'Medium', 'Low'];

export interface Department {
  id: string;
  name: string;
  team: string; // the assignment group name staff see
  description: string;
  helpsWith: string[];
  location: string;
  hours: string;
  phone: string;
  email: string;
  targetResponse: string;
}

export interface Student {
  id: string;
  name: string;
  preferredName: string;
  studentNumber: string;
  email: string;
  phone: string;
  programme: string;
  faculty: string;
  year: string;
  mode: 'Full-time' | 'Part-time';
  feeStatus: 'Domestic' | 'International';
  tutor: string;
}

export interface StaffMember {
  id: string;
  name: string;
  title: string;
  departmentId: string;
  email: string;
}

export type ActivityKind =
  | 'created'
  | 'triage'
  | 'assigned'
  | 'status'
  | 'priority'
  | 'response'
  | 'note'
  | 'student'
  | 'resolved';

export interface ActivityEntry {
  id: string;
  at: string;
  kind: ActivityKind;
  actor: string;
  text: string;
  body?: string;
  internal?: boolean;
}

export interface Triage {
  category: string;
  urgency: Priority;
  reason: string;
  confidence: number; // 0..1
  signals: string[];
}

export interface Case {
  id: string;
  title: string;
  description: string;
  studentId: string;
  departmentId: string;
  category: string;
  priority: Priority;
  status: Status;
  createdAt: string;
  updatedAt: string;
  assigneeId: string | null;
  contactPreference: 'Email' | 'Phone' | 'In person' | 'Teams call';
  triage: Triage;
  activity: ActivityEntry[];
  resolution?: { at: string; by: string; text: string };
}

/* ---------- Campus Queue Manager ---------- */

export type QueueTokenStatus = 'waiting' | 'in_progress' | 'completed' | 'cancelled';

export interface QueueSummary {
  id: string;
  name: string;
  serviceType: 'certificates' | 'helpdesk' | 'lab_booking';
  departmentId: string;
  prefix: string;
  location: string;
  description: string;
  isPaused: boolean;
  waiting: number;
  nowServing: string | null;
  estimatedWaitMinutes: number; // for someone joining now
}

export interface StudentToken {
  id: string;
  queueId: string;
  queueName: string;
  location: string;
  tokenNumber: string;
  purpose: string | null;
  status: QueueTokenStatus;
  position: number | null;
  createdAt: string;
  calledAt: string | null;
  isPaused: boolean;
  estimatedWaitMinutes: number;
  nowServing: string | null;
}

export interface QueueStats {
  queueId: string;
  servedToday: number;
  waiting: number;
  inProgress: number;
  cancelledToday: number;
  avgWaitMinutes: number | null;
  avgHandlingMinutes: number | null;
}

export interface QueueEntry {
  id: string;
  tokenNumber: string;
  studentName: string;
  studentNumber: string;
  purpose: string | null;
  position: number | null;
  createdAt: string;
  calledAt: string | null;
}

export interface StaffQueueView {
  queue: QueueSummary;
  serving: QueueEntry | null;
  waiting: QueueEntry[];
  stats: QueueStats;
}
