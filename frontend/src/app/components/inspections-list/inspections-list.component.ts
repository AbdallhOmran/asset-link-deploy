import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Inspection {
  id: string;
  assetName: string;
  assetCode: string;
  category: string;
  renter: string;
  status: 'Pending' | 'Passed' | 'Action Required';
  inspectionDate: string;
}

@Component({
  selector: 'app-inspections-list',
  templateUrl: './inspections-list.component.html',
  styleUrls: ['./inspections-list.component.css']
})
export class InspectionsListComponent implements OnInit {

  // بيانات تجريبية للفحوصات
  inspections: Inspection[] = [
    {
      id: 'INS-001',
      assetName: 'Caterpillar 390F Excavator',
      assetCode: 'TE-EXC-001',
      category: 'Excavator',
      renter: 'Apex Construction',
      status: 'Passed',
      inspectionDate: '2026-07-20'
    },
    {
      id: 'INS-002',
      assetName: 'Atlas Copco XRHS 1150',
      assetCode: 'PA-CMP-006',
      category: 'Compressor',
      renter: 'BuildCorp LLC',
      status: 'Action Required',
      inspectionDate: '2026-07-22'
    },
    {
      id: 'INS-003',
      assetName: 'Cummins QSK60 Generator',
      assetCode: 'PA-GEN-008',
      category: 'Generator',
      renter: 'PowerAssets Corp',
      status: 'Pending',
      inspectionDate: '2026-07-23'
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void { }

  // عند الضغط على أي فحص للذهاب إلى تقرير المقارنة
  viewReport(id: string) {
    this.router.navigate(['/inspections', id]);
  }
}
