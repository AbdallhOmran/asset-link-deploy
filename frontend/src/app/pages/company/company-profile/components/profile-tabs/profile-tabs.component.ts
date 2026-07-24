import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-profile-tabs',
  templateUrl: './profile-tabs.component.html',
  styleUrls: ['./profile-tabs.component.css']
})
export class ProfileTabsComponent {
  @Output() tabChanged = new EventEmitter<string>();

  activeTab = 'Overview';

  tabs = [
    'Overview',
    'Team Members',
    'Listed Assets',
    'Reviews'
  ];

  selectTab(tab: string) {
    this.activeTab = tab;
    this.tabChanged.emit(tab);
  }

}
