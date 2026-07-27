import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html'
})
export class DataTableComponent {
  @Input() columns: { field: string, header: string }[] = []; 
  
  @Input() data: any[] = []; 
  
  @Output() actionClicked = new EventEmitter<any>(); 
}