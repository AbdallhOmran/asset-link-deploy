export type InspectionStatus = 'Passed' | 'Failed';

export interface InspectionChecklist {
  brakes: boolean;
  engine: boolean;
  body: boolean;
  tires: boolean;
  lights: boolean;
}

export interface InspectionRecord {
  _id: string;
  bookingId: any;
  assetId: any;
  inspectorName: string;
  photos: string[];
  notes: string;
  checklist: InspectionChecklist;
  conditionScore: number;
  status: InspectionStatus;
  phase?: 'Pre-Rental' | 'Post-Rental' | 'Inspection';
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInspectionPayload {
  bookingId: string;
  assetId: string;
  inspectorName: string;
  photos: string[];
  notes: string;
  checklist: InspectionChecklist;
  conditionScore: number;
  status: InspectionStatus;
}

export interface InspectionStats {
  total: number;
  passedCount: number;
  failedCount: number;
  averageScore: number;
}

export interface InspectionFilterOptions {
  searchQuery: string;
  statusFilter: 'all' | InspectionStatus;
}
