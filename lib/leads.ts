export type LeadStatus = "new" | "contacted" | "qualified" | "proposal_sent" | "won" | "lost";
export type DepositStatus = "not-discussed" | "not-requested" | "awaiting" | "partial" | "paid";

export type LeadRecord = {
  id: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  business_name: string | null;
  email: string | null;
  phone: string | null;
  preferred_contact: "whatsapp" | "email" | "phone";
  service: string;
  package_id: string;
  brief: string;
  budget_range: string;
  preferred_deadline: string;
  attribution: Record<string, string>;
  status: LeadStatus;
  assigned_to: string | null;
  internal_notes: string;
  quoted_amount: number | null;
  deposit_status: DepositStatus;
  follow_up_date: string | null;
};

export const leadStatuses: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal_sent", label: "Proposal sent" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

export const depositStatuses: { value: DepositStatus; label: string }[] = [
  { value: "not-discussed", label: "Not discussed" },
  { value: "not-requested", label: "Not requested" },
  { value: "awaiting", label: "Awaiting" },
  { value: "partial", label: "Partial" },
  { value: "paid", label: "Paid" },
];
