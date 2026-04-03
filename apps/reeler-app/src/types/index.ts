// ─── Reeler App Types ────────────────────────────────────────────────────────

export interface ReelerProfile {
  id: string;
  name: string;
  phone: string;
  reelerId: string;
  village: string;
  district: string;
  state: string;
  dateOfBirth: string;
  gender: string;
  kycStatus: "approved" | "pending" | "rejected";
  bankAccountLast4: string;
  bankName: string;
  clusterAssignment: string;
  totalEarningsToday: number;
  totalEarningsThisMonth: number;
  totalEarningsLifetime: number;
  qrCodeData: string;
}

export interface CollectionRecord {
  id: string;
  date: string;
  collectorName: string;
  netWeight: number;
  qualityGrade: string;
  paymentStatus: "paid" | "pending" | "processing";
  amount: number;
  ticketId: string;
  fieldWeight: number;
  factoryWeight: number;
  variancePercent: number;
  varianceKg: number;
  moistureContent: number;
  baseRatePerKg: number;
  grossAmount: number;
  qualityDeductions: number;
  netPayable: number;
  paymentUtr: string;
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  method: "UPI" | "NEFT" | "Cash";
  status: "successful" | "pending" | "failed";
  referenceNumber: string;
  linkedTicketId: string;
}

export interface NotificationItem {
  id: string;
  type: "payment" | "collection" | "schedule" | "system";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  icon: string;
  section: "today" | "yesterday" | "older";
}

export interface UpcomingCollection {
  scheduledDate: string;
  collectorName: string;
  expectedTimeWindow: string;
}

export type LanguageOption = {
  code: string;
  label: string;
  nativeLabel: string;
};
