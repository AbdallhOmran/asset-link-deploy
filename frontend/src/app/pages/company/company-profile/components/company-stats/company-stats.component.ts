import { Component } from '@angular/core';

@Component({
  selector: 'app-company-stats',
  templateUrl: './company-stats.component.html',
  styleUrls: ['./company-stats.component.css']
})
export class CompanyStatsComponent {
 stats = [
    {
      value: '8',
      label: 'Assets Listed'
    },
    {
      value: '142',
      label: 'Total Bookings'
    },
    {
      value: '$1.24M',
      label: 'Revenue (YTD)'
    },
    {
      value: '98.6%',
      label: 'Completion Rate'
    },
    {
      value: '< 2 hrs',
      label: 'Response Time'
    }
  ];
}
