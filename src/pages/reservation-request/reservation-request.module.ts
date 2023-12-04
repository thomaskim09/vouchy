import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReservationRequestPage } from './reservation-request';

@NgModule({
  declarations: [
    ReservationRequestPage,
  ],
  imports: [
    IonicPageModule.forChild(ReservationRequestPage),
  ],
})
export class ReservationRequestPageModule {}
