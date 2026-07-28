import { Component, OnInit } from '@angular/core';
import { PaymentsEscrowService } from 'src/app/services/payments-escrow.service';

@Component({
  selector: 'app-payments-escrow',
  templateUrl: './payments-escrow.component.html',
  styleUrls: ['./payments-escrow.component.css']
})
export class PaymentsEscrowComponent implements OnInit {

  constructor(private paymentService: PaymentsEscrowService) {}

  stats :any[]= [];
  ledger:any[]=[];
  timeline:any[] = [];

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
      // icon: '💰'
    },
    {
      title: 'CURRENTLY IN ESCROW',
      value: res.data.summary.currentlyInEscrow,
      // icon: '🏦'
    },
    {
      title: 'RELEASED (MTD)',
      value: res.data.summary.releasedMTD,
      // icon: '✅'
    },
    {
      title: 'PLATFORM FEE (MTD)',
      value: res.data.summary.platformFee,
      // icon: '💳'
    }
  ];

  this.ledger = res.data.ledger;
  this.timeline = res.data.timeline;
},  
      error: (err) => {
        console.error(err);
      }
    });
  }

}