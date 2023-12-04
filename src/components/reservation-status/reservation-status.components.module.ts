import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { ReservationStatusMainComponent } from './reservation-status-main/reservation-status-main';

@NgModule({
  declarations: [
    ReservationStatusMainComponent,
  ],
  imports: [
    IonicModule
  ],
  exports: [
    ReservationStatusMainComponent,
  ]
})
export class ReservationStatusComponentsModule { }
