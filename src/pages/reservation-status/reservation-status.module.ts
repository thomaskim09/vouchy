import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { ReservationStatusComponentsModule } from '../../components/reservation-status/reservation-status.components.module';
import { ReservationStatusPage } from './reservation-status';
import { ReservationTicketShareComponentsModule } from '../../components/reservation-ticket-share/reservation-ticket-share.components.module';

@NgModule({
  declarations: [
    ReservationStatusPage,
  ],
  imports: [
    IonicPageModule.forChild(ReservationStatusPage),
    ReservationStatusComponentsModule,
    ReservationTicketShareComponentsModule
  ],
})
export class ReservationStatusPageModule { }
