export type InspectionStatus = 'Pending' | 'Passed' | 'Failed';

export type InspectionType = 'before_use' | 'after_return';

export type DamageLevel =
  | 'none'
  | 'minor'
  | 'moderate'
  | 'severe';

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

  taxRegister?: string;
  commercialRegister?: string;

  photos: string[];

  notes: string;

  checklist: InspectionChecklist;

  conditionScore: number;

  inspectionType: InspectionType;

  hasDamage: boolean;

  damageLevel: DamageLevel;

  damageCost: number;

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

  taxRegister?: string;

  commercialRegister?: string;

  photos: string[];

  notes: string;

  checklist: InspectionChecklist;

  conditionScore: number;

  inspectionType: InspectionType;

  hasDamage: boolean;

  damageLevel: DamageLevel;

  damageCost: number;

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

  typeFilter: 'all' | InspectionType;
}