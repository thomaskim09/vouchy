import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { ReservationCalendarComponentModule } from '../../components/reservation/reservation-calendar/reservation-calendar.module';
import { ReservationComponentsModule } from '../../components/reservation/reservation.components.module';
import { ReservationPage } from './reservation';

@NgModule({
  declarations: [
    ReservationPage,
  ],
  imports: [
    IonicPageModule.forChild(ReservationPage),
    ReservationCalendarComponentModule,
    ReservationComponentsModule
  ],
})
export class ReservationPageModule { }
