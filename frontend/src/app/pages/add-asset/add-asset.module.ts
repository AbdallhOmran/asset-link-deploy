import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  ClipboardList,
  DollarSign,
  Image,
  MapPin,
  Settings,
  Wrench,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Check,
  UploadCloud,
  X,
  Plus,
  AlertTriangle,
  Info,
  Building2,
  FileText,
  Hash,
  Calendar,
  CheckCircle2,
} from 'lucide-angular';

import { AddAssetComponent } from './add-asset.component';
import { BasicInfoSectionComponent } from './sections/basic-info-section/basic-info-section.component';
import { PricingSectionComponent } from './sections/pricing-section/pricing-section.component';
import { ImagesSectionComponent } from './sections/images-section/images-section.component';
import { LocationSectionComponent } from './sections/location-section/location-section.component';
import { SpecsSectionComponent } from './sections/specs-section/specs-section.component';
import { MaintenanceSectionComponent } from './sections/maintenance-section/maintenance-section.component';

const routes: Routes = [
  { path: '', component: AddAssetComponent }
];

@NgModule({
  declarations: [
    AddAssetComponent,
    BasicInfoSectionComponent,
    PricingSectionComponent,
    ImagesSectionComponent,
    LocationSectionComponent,
    SpecsSectionComponent,
    MaintenanceSectionComponent,
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    LucideAngularModule.pick({
      ClipboardList, DollarSign, Image, MapPin, Settings, Wrench,
      ChevronRight, ArrowLeft, ArrowRight, Check, UploadCloud, X,
      Plus, AlertTriangle, Info, Building2, FileText, Hash, Calendar,
      CheckCircle2,
    }),
  ],
})
export class AddAssetModule {}
