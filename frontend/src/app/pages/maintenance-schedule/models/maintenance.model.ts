export type MaintenanceStatusType = 'current' | 'upcoming' | 'in-progress' | 'overdue';
export type MaintenanceRecordStatus = 'completed' | 'in-progress' | 'scheduled' | 'cancelled';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export interface MaintenanceRecord {
  id: string;
  assetId: string;
  assetName: string;
  assetCode: string;
  category: string;
  type: string;
  tech: string;
  date: string;
  hrs: number;
  status: MaintenanceRecordStatus;
  desc: string;
  priority: PriorityLevel;
  cost?: number;
}

export interface AssetMaintenanceSummary {
  assetId: string;
  assetName: string;
  assetCode: string;
  category: string;
  company: string;
  maintenanceStatus: MaintenanceStatusType;
  lastMaintenance: string;
  nextMaintenance: string;
  hoursOperated: number;
  healthScore: number;
  thresholdHours: number;
}

export interface NewMaintenanceRequest {
  assetId: string;
  assetName?: string;
  maintenanceType: string;
  scheduledDate: string;
  technician: string;
  priority: PriorityLevel;
  notes: string;
  estimatedHours?: number;
}

export interface MaintenanceFilterOptions {
  searchQuery: string;
  statusFilter: 'all' | MaintenanceStatusType;
  categoryFilter: string;
  priorityFilter: string;
}

export interface MaintenanceStats {
  totalAssets: number;
  currentCount: number;
  upcomingCount: number;
  inProgressCount: number;
  overdueCount: number;
  totalMaintenanceCostThisMonth: number;
}
