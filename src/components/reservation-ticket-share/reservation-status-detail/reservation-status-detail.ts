import { Component, Input } from '@angular/core';
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'reservation-status-detail',
  templateUrl: 'reservation-status-detail.html'
})
export class ReservationStatusDetailComponent {

  @Input('reservationDetails') input: any;
  date: any;
  time: string;

  constructor() { }

  ngOnChanges() {
    if (this.input) {
      this.date = this.getDate(this.input.dateTime);
      let timeString = this.getTime(this.input.dateTime);
      if (timeString.charAt(0) === '0') {
        timeString = timeString.substr(1);
      }
      this.time = timeString.toLowerCase();
    }
  }

  getDate(dateTime) {
    if (typeof dateTime === 'object') {
      return format(dateTime, 'dd-MM-yyyy');
    } else {
      return format(parseISO(dateTime), 'dd-MM-yyyy');
    }
  }

  getTime(dateTime) {
    if (typeof dateTime === 'object') {
      return format(dateTime, 'hh:mm a');
    } else {
      return format(parseISO(dateTime), 'hh:mm a');
    }
  }
}
