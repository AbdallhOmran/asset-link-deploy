import { Component, OnInit } from '@angular/core';
import { PaymentsEscrowService } from 'src/app/services/payments-escrow.service';

@Component({
  selector: 'app-payments-escrow',
  templateUrl: './payments-escrow.component.html',
  styleUrls: ['./payments-escrow.component.css']
})
export class PaymentsEscrowComponent implements OnInit {

  constructor(private paymentService: PaymentsEscrowService) {}

  stats = [
    {
      title: 'TOTAL PROCESSED',
      value: '$1.24M',
      icon: '💰'
    },
    {
      title: 'CURRENTLY IN ESCROW',
      value: '$144,790',
      icon: '🏦'
    },
    {
      title: 'RELEASED (MTD)',
      value: '$98,740',
      icon: '✅'
    },
    {
      title: 'PLATFORM FEE (MTD)',
      value: '$12,478',
      icon: '💳'
    }
  ];

  ledger = [
    {
      escrowId: 'ESC-0481',
      booking: 'BK-2847',
      from: 'Apex Construction',
      to: 'TerraEquip LLC',
      total: '$34,150',
      held: '$6,830',
      released: '$27,320',
      date: 'Jul 10, 2025',
      status: 'In Escrow'
    },
    {
      escrowId: 'ESC-0480',
      booking: 'BK-2846',
      from: 'Meridian Infrastructure',
      to: 'IndustrialAssets Co',
      total: '$10,500',
      held: '$2,100',
      released: '$8,400',
      date: 'Jul 8, 2025',
      status: 'In Escrow'
    },
    {
      escrowId: 'ESC-0479',
      booking: 'BK-2845',
      from: 'Summit Engineering',
      to: 'HeavyLift Partners',
      total: '$64,000',
      held: '-',
      released: '$64,000',
      date: 'Jun 15, 2025',
      status: 'Released'
    }
  ];

  timeline = [
    {
      title: 'Escrow ESC-0481 created — $34,150 deposited',
      date: 'Jul 10, 2025',
      status: 'In Escrow',
      color: 'bg-orange-400'
    },
    {
      title: 'Milestone 1 released — $13,660 to TerraEquip LLC',
      date: 'Jul 14, 2025',
      status: 'Released',
      color: 'bg-emerald-500'
    },
    {
      title: 'Milestone 2 released — $13,660 to TerraEquip LLC',
      date: 'Jul 19, 2025',
      status: 'Released',
      color: 'bg-emerald-500'
    },
    {
      title: 'Final release pending inspection — $6,830 held',
      date: 'Jul 28, 2025',
      status: 'Pending',
      color: 'bg-blue-500'
    }
  ];

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.paymentService.getDashboard().subscribe({
      next: (res) => {

  console.log(res);

  this.stats = [
    {
      title: 'TOTAL PROCESSED',
      value: res.data.summary.totalProcessed,
      icon: '💰'
    },
    {
      title: 'CURRENTLY IN ESCROW',
      value: res.data.summary.currentlyInEscrow,
      icon: '🏦'
    },
    {
      title: 'RELEASED (MTD)',
      value: res.data.summary.releasedMTD,
      icon: '✅'
    },
    {
      title: 'PLATFORM FEE (MTD)',
      value: res.data.summary.platformFee,
      icon: '💳'
    }
  ];

  this.ledger = res.data.ledger;

},  
      error: (err) => {
        console.error(err);
      }
    });
  }

}