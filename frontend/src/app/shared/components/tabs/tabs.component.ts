import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
})
export class TabsComponent {
  @Input() tabs: string[] = [];

  @Input() activeTab: number = 0;
  @Output() activeTabChange = new EventEmitter<number>();

  selectTab(index: number) {
    this.activeTab = index;
    this.activeTabChange.emit(index);
  }
}
