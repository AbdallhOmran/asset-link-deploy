import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AssetDetailsComponent } from './asset-details.component';

const routes: Routes = [{ path: '', component: AssetDetailsComponent }];

@NgModule({
  declarations: [AssetDetailsComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
})
export class AssetDetailsModule {}
