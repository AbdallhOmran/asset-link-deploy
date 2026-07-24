import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NegotiationRoomComponent } from './pages/negotiation-room/negotiation-room.component';

const routes: Routes = [
  {
    path: '',
    component: NegotiationRoomComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
