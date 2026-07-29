import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-inspection-detail',
  templateUrl: './inspection-detail.component.html',
  styleUrls: ['./inspection-detail.component.css']
})
export class InspectionDetailComponent implements OnInit {
  inspectionId: string | null = null;

  // بيانات تقرير المقارنة (Pre vs Post Rental)
  reportData = {
    assetName: 'Caterpillar 390F Excavator',
    assetCode: 'TE-EXC-001',
    renter: 'Apex Construction',
    rentalPeriod: 'Jul 1, 2026 - Jul 20, 2026',
    preRental: {
      date: '2026-07-01',
      inspector: 'John Doe',
      condition: 'Excellent',
      workingHours: 1200,
      fuelLevel: '100%',
      notes: 'Equipment in prime condition, no visible scratches or mechanical issues.',
      status: 'Passed'
    },
    postRental: {
      date: '2026-07-20',
      inspector: 'Sarah Smith',
      condition: 'Fair - Minor Damage',
      workingHours: 1350,
      fuelLevel: '45%',
      notes: 'Minor scratch on the left hydraulic arm. Requires routine fluid check.',
      status: 'Action Required'
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // الحصول على الـ ID الخاص بالفحص من الـ URL
    this.inspectionId = this.route.snapshot.paramMap.get('id');
  }

  goBack() {
    this.router.navigate(['/inspections']);
  }
}
