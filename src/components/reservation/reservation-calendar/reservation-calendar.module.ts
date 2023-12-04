import { IonicPageModule } from 'ionic-angular';
import { NgCalendarModule } from 'ionic2-calendar';
import { NgModule } from '@angular/core';
import { ReservationCalendarComponent } from './reservation-calendar';

@NgModule({
  declarations: [
    ReservationCalendarComponent
  ],
  imports: [
    IonicPageModule.forChild(ReservationCalendarComponent),
    NgCalendarModule
  ],
  exports: [
    ReservationCalendarComponent
  ]
})
export class ReservationCalendarComponentModule { }
