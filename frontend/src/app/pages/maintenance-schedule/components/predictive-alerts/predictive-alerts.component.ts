import { Component, Input } from '@angular/core';
import { AssetMaintenanceSummary } from '../../models/maintenance.model';

@Component({
  selector: 'app-predictive-alerts',
  templateUrl: './predictive-alerts.component.html',
  styleUrls: ['./predictive-alerts.component.css']
})
export class PredictiveAlertsComponent {
  @Input() assets: AssetMaintenanceSummary[] = [];

  get approachingMaintenanceAssets(): AssetMaintenanceSummary[] {
    return this.assets.filter(a => {
      const pct = a.hoursOperated / a.thresholdHours;
      return pct >= 0.8 || a.maintenanceStatus === 'upcoming' || a.maintenanceStatus === 'overdue';
    });
  }

  getPct(asset: AssetMaintenanceSummary): number {
    return Math.min(100, Math.round((asset.hoursOperated / asset.thresholdHours) * 100));
  }
}
