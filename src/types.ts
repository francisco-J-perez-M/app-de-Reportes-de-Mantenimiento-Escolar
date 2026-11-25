export type UserRole = 'student' | 'admin';

export interface UserSession {
  email: string;
  role: UserRole;
}

export type ReportStatus = 'pending' | 'in_progress' | 'resolved';

export interface MaintenanceReport {
  id: string;
  title: string;
  description: string;
  area: string;
  createdAt: string;
  photoUri?: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number | null;
  manualLocation?: string;
  status: ReportStatus;
  createdBy: string;
}
