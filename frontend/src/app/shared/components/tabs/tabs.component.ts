import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
})
export class TabsComponent {
  @Input() tabs: string[] = [];

  @Input() activeTab: number = 0;

  selectTab(index: number) {
    this.activeTab = index;
  }
}
