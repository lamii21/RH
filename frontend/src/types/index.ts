export type Role = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

export interface Employee {
  id: number;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  phone?: string;
  jobTitle?: string;
  departmentId?: number;
  departmentName?: string;
  leaveBalance: number;
}

export interface LeaveRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  type: 'ANNUAL' | 'SICK' | 'MATERNITY' | 'PATERNITY' | 'UNPAID' | 'OTHER';
  reason: string;
  managerComment?: string;
}

export interface Attendance {
  id: number;
  employeeId: number;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  workHours?: number;
  status: 'PRESENT' | 'LATE' | 'ABSENT' | 'HALF_DAY';
}

export interface Document {
  id: number;
  employeeId: number;
  employeeName: string;
  fileName: string;
  documentType: string;
  uploadedAt: string;
}

export interface DashboardStats {
  totalEmployees: number;
  totalDepartments: number;
  leavesPending: number;
  todayAbsences: number;
  employeesPerDepartment: Record<string, number>;
  riskyEmployees: RiskyEmployee[];
}

export interface RiskyEmployee {
  employeeId: number;
  employeeName: string;
  absenceCount: number;
  lateCount: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}
