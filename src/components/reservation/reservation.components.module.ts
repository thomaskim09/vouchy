import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ReservationInputComponent } from './reservation-input/reservation-input';
import { ReservationButtonComponent } from './reservation-button/reservation-button';

@NgModule({
  declarations: [
    ReservationInputComponent,
    ReservationButtonComponent,
  ],
  imports: [
    IonicModule
  ],
  exports: [
    ReservationInputComponent,
    ReservationButtonComponent,
  ]
})
export class ReservationComponentsModule { }
