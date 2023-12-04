import lo_includes from 'lodash/includes';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { CommonService } from '../../../providers/common/common.service';
import { Component, ViewChild, Input } from '@angular/core';
import { DataService } from '../../../providers/data-service/data.service';
import { addDays, isBefore, subDays, setDay, isSameDay, parseISO } from 'date-fns';

@Component({
  selector: 'reservation-calendar',
  templateUrl: 'reservation-calendar.html'
})
export class ReservationCalendarComponent {

  @Input('reservationCalendar') input: any;

  @ViewChild(CalendarComponent) myCalendar: CalendarComponent;
  eventSource: any = [];

  viewTitle: string;
  selectedDay = new Date();
  lockSwipeToPrev: boolean;

  restDays: any = [];
  restTitle: string;
  holidays: any = [];

  // skeleton
  skeletonRows: any[] = new Array(5);
  skeletonCols: any[] = new Array(7);

  calendar: any = {
    mode: 'month',
    currentDate: new Date()
  };

  constructor(
    public commonService: CommonService,
    public dataService: DataService) { }

  ngOnChanges() {
    if (this.input) {
      if (this.input.routineRestDay[0] !== 0) {
        this.input.routineRestDay.map(val => this.getRestdays(val));
      }
    }
  }

  private getRestdays(routineRestDay) {
    let restOnDay;
    switch (routineRestDay) {
      case 1: restOnDay = this.setRestDay('Monday', routineRestDay); break;
      case 2: restOnDay = this.setRestDay('Tuesday', routineRestDay); break;
      case 3: restOnDay = this.setRestDay('Wednesday', routineRestDay); break;
      case 4: restOnDay = this.setRestDay('Thursday', routineRestDay); break;
      case 5: restOnDay = this.setRestDay('Friday', routineRestDay); break;
      case 6: restOnDay = this.setRestDay('Saturday', routineRestDay); break;
      case 7: restOnDay = this.setRestDay('Sunday', routineRestDay); break;
    }
    const limit = addDays(new Date(), this.input.maxReservationDay);
    while (isBefore(restOnDay, limit)) {
      this.restDays.push({ title: this.restTitle, date: restOnDay });
      restOnDay = addDays(restOnDay, 7);
    }
  }

  private setRestDay(day, routineRestDay) {
    this.restTitle = `Closed on every ${day}`;
    return setDay(new Date(), routineRestDay, { weekStartsOn: 1 });
  }

  markDisabled = (date: Date) => {
    if (this.input) {
      const maxDayToDate = addDays(new Date(), this.input.maxReservationDay);
      const yesterday = subDays(new Date(), 1);
      const restDays = this.restDays;
      const holidays = this.input.holidays;

      // Disable min and max day
      if (date < yesterday) {
        return true;
      } else if (date > maxDayToDate) {
        return true;
      }

      // For easy compare
      date.setHours(0, 0, 0, 0);

      // Disable every rest day of week
      let compareDate = [];
      let compareDate2 = [];
      if (restDays.length !== 0) {
        compareDate = restDays.map(val => {
          if (isSameDay(date, val.date)) {
            this.addEvent(val.title, date);
            return true;
          }
        });
      }
      if ((lo_includes([...compareDate], true))) { return true; }

      // Disable holiday
      if (holidays.length !== 0) {
        compareDate2 = holidays.map(val => {
          if (isSameDay(date, parseISO(val.holidayDate))) {
            this.addEvent('Closed on ' + val.holidayName, date);
            return true;
          }
        });
      }
      if ((lo_includes([...compareDate2], true))) { return true; }
    } else {
      return false;
    }
  }

  addEvent(title, date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const startTime = new Date(Date.UTC(year, month, day));
    const endTime = new Date(Date.UTC(year, month, day + 1));
    const data = {
      title: title,
      startTime: startTime,
      endTime: endTime,
      allDay: true
    };
    this.eventSource.push(data);
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onTimeSelected(ev) {
    if (ev.events.length !== 0) {
      this.commonService.presentToast(ev.events[0].title, 1500);
    } else if (ev.disabled) {
      return;
    } else {
      // Notify input and button components
      this.dataService.changeReservation({
        selectedDate: ev.selectedTime
      });
    }
  }

  next() {
    const mySwiper = document.querySelector('.swiper-container')['swiper'];
    mySwiper.slideNext();
  }

  prev() {
    const mySwiper = document.querySelector('.swiper-container')['swiper'];
    mySwiper.slidePrev();
  }
}
