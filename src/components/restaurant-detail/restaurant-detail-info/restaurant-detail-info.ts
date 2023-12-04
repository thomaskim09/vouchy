import { Component, Input } from '@angular/core';
import { parse, format } from 'date-fns';

@Component({
  selector: 'restaurant-detail-info',
  templateUrl: 'restaurant-detail-info.html'
})
export class RestaurantDetailInfoComponent {

  @Input('restaurantDetailInfo') input: any;

  businessHour: string;

  constructor() { }

  ngOnChanges() {
    if (this.input) {
      this.getTodayBusinessHours();
    }
  }

  private getTodayBusinessHours() {
    if (this.checkIfHolidays()) {
      return;
    }

    const today = new Date();
    const day = today.getDay();
    let localDay = day - 1;
    if (localDay < 0) {
      localDay = 6;
    }
    const businessHours = this.input.businessHours[localDay];
    if (businessHours.section.length === 0) {
      this.businessHour = 'Shop is closed today';
    } else {
      let resultText = 'Open from ';
      businessHours.section.map(val => resultText += formatTime(val.openTime) + ' to ' + formatTime(val.closeTime) + ' & ');
      this.businessHour = resultText.slice(0, -3);
    }

    function formatTime(time) {
      const parsed = parse(time, 'HH:mm', new Date());
      let result = format(parsed, 'hh:mm a');
      if (result.charAt(0) === '0') {
        result = result.substr(1);
      }
      return result.toLowerCase();
    }
  }

  private checkIfHolidays() {
    const holiday = this.input.holidays;
    const result = holiday.map(val => {
      if (this.isToday(new Date(val.holidayDate))) {
        this.businessHour = `Shop is closed today (${val.holidayName})`;
        return true;
      } else {
        return false;
      }
    });
    return result.includes(true);
  }

  private isToday(someDate) {
    const today = new Date();
    return someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear();
  }

  getRestDay() {
    let resultText = 'Shop rest on every ';
    this.input.routineRestDay.map(val => {
      switch (val) {
        case 1: resultText += 'Monday & '; break;
        case 2: resultText += 'Tuesday & '; break;
        case 3: resultText += 'Wednesday &'; break;
        case 4: resultText += 'Thursday & '; break;
        case 5: resultText += 'Friday & '; break;
        case 6: resultText += 'Saturday & '; break;
        case 7: resultText += 'Sunday & '; break;
        default: resultText = 'Shop open every day & '; break;
      }
    });
    return resultText.slice(0, -2);
  }

  getRestriction() {
    let resultText;
    switch (this.input.restriction) {
      case 'HL': resultText = 'Halal'; break;
      case 'PL': resultText = 'No Pork No Lard'; break;
      case 'NO': resultText = 'Non Halal'; break;
    }
    if (this.input.isVegetarian) {
      resultText += ' & Vegetarian Friendly';
    }
    return resultText;
  }

}
