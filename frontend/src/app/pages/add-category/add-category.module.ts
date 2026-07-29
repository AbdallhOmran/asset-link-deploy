import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Tag,
  Check,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  X,
  Plus,
} from 'lucide-angular';

import { AddCategoryComponent } from './add-category.component';

const routes: Routes = [{ path: '', component: AddCategoryComponent }];

@NgModule({
  declarations: [AddCategoryComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    LucideAngularModule.pick({
      Tag, Check, AlertTriangle, CheckCircle2, ArrowLeft, X, Plus,
    }),
  ],
})
export class AddCategoryModule {}
