import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import {
  MaintenanceRecord,
  AssetMaintenanceSummary,
  NewMaintenanceRequest,
  MaintenanceFilterOptions,
  MaintenanceStats,
  MaintenanceStatusType
} from '../models/maintenance.model';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  // ── Mock Initial State based on AssetLink Dashboard reference data ──
  private readonly initialAssets: AssetMaintenanceSummary[] = [
    {
      assetId: 'A-001',
      assetCode: 'TE-EXC-001',
      assetName: 'Caterpillar 390F Excavator',
      category: 'Excavator',
      company: 'TerraEquip LLC',
      maintenanceStatus: 'current',
      lastMaintenance: 'Jun 28, 2025',
      nextMaintenance: 'Sep 28, 2025',
      hoursOperated: 2847,
      healthScore: 94,
      thresholdHours: 3000
    },
    {
      assetId: 'A-002',
      assetCode: 'HL-CRN-002',
      assetName: 'Liebherr LTM 1100 Crane',
      category: 'Mobile Crane',
      company: 'HeavyLift Partners',
      maintenanceStatus: 'upcoming',
      lastMaintenance: 'May 10, 2025',
      nextMaintenance: 'Aug 10, 2025',
      hoursOperated: 4120,
      healthScore: 89,
      thresholdHours: 4500
    },
    {
      assetId: 'A-003',
      assetCode: 'IA-FORK-003',
      assetName: 'Toyota 8FBU25 Forklift',
      category: 'Forklift',
      company: 'IndustrialAssets Co',
      maintenanceStatus: 'current',
      lastMaintenance: 'Jul 01, 2025',
      nextMaintenance: 'Oct 01, 2025',
      hoursOperated: 1450,
      healthScore: 97,
      thresholdHours: 2000
    },
    {
      assetId: 'A-004',
      assetCode: 'TE-BULL-004',
      assetName: 'Komatsu D65EX Bulldozer',
      category: 'Bulldozer',
      company: 'TerraEquip LLC',
      maintenanceStatus: 'in-progress',
      lastMaintenance: 'Jan 15, 2025',
      nextMaintenance: 'Jul 18, 2025',
      hoursOperated: 3890,
      healthScore: 72,
      thresholdHours: 4000
    },
    {
      assetId: 'A-005',
      assetCode: 'AW-BOOM-005',
      assetName: 'Genie S-125 Boom Lift',
      category: 'Aerial Platform',
      company: 'AerialWorks Inc',
      maintenanceStatus: 'overdue',
      lastMaintenance: 'Nov 20, 2024',
      nextMaintenance: 'May 20, 2025',
      hoursOperated: 2980,
      healthScore: 64,
      thresholdHours: 3000
    },
    {
      assetId: 'A-006',
      assetCode: 'PA-COMP-006',
      assetName: 'Atlas Copco XRHS 1150',
      category: 'Compressor',
      company: 'PowerAssets Corp',
      maintenanceStatus: 'current',
      lastMaintenance: 'Jun 15, 2025',
      nextMaintenance: 'Sep 15, 2025',
      hoursOperated: 1820,
      healthScore: 91,
      thresholdHours: 2500
    }
  ];

  private readonly initialRecords: MaintenanceRecord[] = [
    {
      id: 'M-101',
      assetId: 'A-001',
      assetCode: 'TE-EXC-001',
      assetName: 'Caterpillar 390F Excavator',
      category: 'Excavator',
      type: 'Scheduled Service',
      tech: 'Jake Morrison',
      date: 'Jun 28, 2025',
      hrs: 2847,
      status: 'completed',
      priority: 'medium',
      desc: 'Oil change, hydraulic fluid top-up, filter replacement, track tension inspection, grease all fittings.',
      cost: 1450
    },
    {
      id: 'M-102',
      assetId: 'A-001',
      assetCode: 'TE-EXC-001',
      assetName: 'Caterpillar 390F Excavator',
      category: 'Excavator',
      type: 'Engine Service',
      tech: 'Maria Santos',
      date: 'Mar 12, 2025',
      hrs: 2501,
      status: 'completed',
      priority: 'high',
      desc: 'Full engine tune-up, fuel injector cleaning, serpentine belt replacement, coolant flush.',
      cost: 3200
    },
    {
      id: 'M-103',
      assetId: 'A-004',
      assetCode: 'TE-BULL-004',
      assetName: 'Komatsu D65EX Bulldozer',
      category: 'Bulldozer',
      type: 'Hydraulic Overhaul',
      tech: 'Jake Morrison',
      date: 'Jul 18, 2025',
      hrs: 3890,
      status: 'in-progress',
      priority: 'high',
      desc: 'Hydraulic pump rebuild, all seals replaced, pressure relief valve calibrated, system leak tested.',
      cost: 4800
    },
    {
      id: 'M-104',
      assetId: 'A-005',
      assetCode: 'AW-BOOM-005',
      assetName: 'Genie S-125 Boom Lift',
      category: 'Aerial Platform',
      type: 'Safety Compliance Check & Track Replacement',
      tech: 'Tom Becker',
      date: 'May 20, 2025',
      hrs: 2980,
      status: 'scheduled',
      priority: 'urgent',
      desc: 'Annual mandatory safety inspection, basket boom cable tensioning, hydraulic seal check.',
      cost: 2100
    },
    {
      id: 'M-105',
      assetId: 'A-002',
      assetCode: 'HL-CRN-002',
      assetName: 'Liebherr LTM 1100 Crane',
      category: 'Mobile Crane',
      type: 'Preventive Maintenance',
      tech: 'Maria Santos',
      date: 'Aug 10, 2025',
      hrs: 4120,
      status: 'scheduled',
      priority: 'medium',
      desc: 'Boom extension lube, outrigger hydraulic check, load sensor calibration.',
      cost: 1950
    }
  ];

  // BehaviorSubjects for reactive state management
  private assetsSubject = new BehaviorSubject<AssetMaintenanceSummary[]>(this.initialAssets);
  private recordsSubject = new BehaviorSubject<MaintenanceRecord[]>(this.initialRecords);
  private filterSubject = new BehaviorSubject<MaintenanceFilterOptions>({
    searchQuery: '',
    statusFilter: 'all',
    categoryFilter: 'all',
    priorityFilter: 'all'
  });

  public assets$: Observable<AssetMaintenanceSummary[]> = this.assetsSubject.asObservable();
  public records$: Observable<MaintenanceRecord[]> = this.recordsSubject.asObservable();
  public filters$: Observable<MaintenanceFilterOptions> = this.filterSubject.asObservable();

  // Filtered records pipeline
  public filteredRecords$: Observable<MaintenanceRecord[]> = this.recordsSubject.pipe(
    map(records => {
      const filters = this.filterSubject.value;
      return records.filter(r => {
        const matchesQuery = !filters.searchQuery ||
          r.assetName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          r.assetCode.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          r.tech.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          r.type.toLowerCase().includes(filters.searchQuery.toLowerCase());

        const matchesStatus = filters.statusFilter === 'all' || r.status === filters.statusFilter;
        const matchesCategory = filters.categoryFilter === 'all' || r.category === filters.categoryFilter;
        const matchesPriority = filters.priorityFilter === 'all' || r.priority === filters.priorityFilter;

        return matchesQuery && matchesStatus && matchesCategory && matchesPriority;
      });
    })
  );

  // Statistics calculation pipeline
  public stats$: Observable<MaintenanceStats> = this.assets$.pipe(
    map(assets => {
      const records = this.recordsSubject.value;
      return {
        totalAssets: assets.length,
        currentCount: assets.filter(a => a.maintenanceStatus === 'current').length,
        upcomingCount: assets.filter(a => a.maintenanceStatus === 'upcoming').length,
        inProgressCount: assets.filter(a => a.maintenanceStatus === 'in-progress').length,
        overdueCount: assets.filter(a => a.maintenanceStatus === 'overdue').length,
        totalMaintenanceCostThisMonth: records.reduce((sum, r) => sum + (r.cost || 0), 0)
      };
    })
  );

  constructor() {}

  // ── Actions ──
  public updateFilters(newFilters: Partial<MaintenanceFilterOptions>): void {
    this.filterSubject.next({
      ...this.filterSubject.value,
      ...newFilters
    });
  }

  public requestNewMaintenance(req: NewMaintenanceRequest): Observable<MaintenanceRecord> {
    const selectedAsset = this.assetsSubject.value.find(a => a.assetId === req.assetId);

    const newRecord: MaintenanceRecord = {
      id: `M-${Math.floor(100 + Math.random() * 900)}`,
      assetId: req.assetId,
      assetCode: selectedAsset?.assetCode || 'UNKNOWN',
      assetName: req.assetName || selectedAsset?.assetName || 'Selected Asset',
      category: selectedAsset?.category || 'General Equipment',
      type: req.maintenanceType,
      tech: req.technician || 'Unassigned',
      date: req.scheduledDate,
      hrs: selectedAsset?.hoursOperated || 0,
      status: 'scheduled',
      priority: req.priority,
      desc: req.notes,
      cost: req.estimatedHours ? req.estimatedHours * 120 : 500
    };

    const updatedRecords = [newRecord, ...this.recordsSubject.value];
    this.recordsSubject.next(updatedRecords);

    // Update asset status if needed
    if (selectedAsset) {
      const updatedAssets = this.assetsSubject.value.map(a => {
        if (a.assetId === req.assetId) {
          return {
            ...a,
            maintenanceStatus: 'upcoming' as MaintenanceStatusType,
            nextMaintenance: req.scheduledDate
          };
        }
        return a;
      });
      this.assetsSubject.next(updatedAssets);
    }

    return new Observable(observer => {
      observer.next(newRecord);
      observer.complete();
    });
  }
}
