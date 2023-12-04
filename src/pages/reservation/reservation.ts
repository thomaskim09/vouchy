import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestaurantService } from '../../providers/restaurant/restaurant.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-reservation',
  templateUrl: 'reservation.html',
})
export class ReservationPage {

  restaurantName: string;

  reservationButton: any;
  reservationCalendar: any;
  reservationInput: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public restaurantProvider: RestaurantService) { }

  ngOnInit() {
    this.restaurantName = this.navParams.get('restaurantName');
    const restaurantId = this.navParams.get('restaurantId');
    this.setUpReservationInfo(restaurantId);
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private setUpReservationInfo(restaurantId) {
    this.restaurantProvider.getRestaurantReservationInfo(restaurantId).pipe(untilDestroyed(this)).subscribe(val => {
      const re = val.reservationSettings;
      this.reservationCalendar = {
        maxReservationDay: re.maxReservationDay,
        routineRestDay: val.details.routineRestDay,
        holidays: re.holidays || [],
      };
      this.reservationInput = {
        businessHours: val.details.businessHours,
        paxSettings: re.paxSettings,
        remarkManual: re.remarkManual || [],
      };
      this.reservationButton = {
        restaurantId: restaurantId,
        restaurantName: this.restaurantName,
      };
    });
  }

  back() {
    this.navCtrl.pop();
  }

}
