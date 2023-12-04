import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { ReservationStatusButtonComponent } from './reservation-status-button/reservation-status-button';
import { ReservationStatusDetailComponent } from './reservation-status-detail/reservation-status-detail';

@NgModule({
  declarations: [
    ReservationStatusDetailComponent,
    ReservationStatusButtonComponent,
  ],
  imports: [
    IonicModule
  ],
  exports: [
    ReservationStatusDetailComponent,
    ReservationStatusButtonComponent,
  ]
})
export class ReservationTicketShareComponentsModule { }
