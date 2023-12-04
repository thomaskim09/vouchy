import { Component, Input } from '@angular/core';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { NavController, Platform } from 'ionic-angular';
import { TicketQrPage } from '../../../pages/ticket-qr/ticket-qr';

@Component({
  selector: 'voucher-detail-restaurant',
  templateUrl: 'voucher-detail-restaurant.html'
})
export class VoucherDetailRestaurantComponent {

  @Input('restaurantDetails') input: any;

  contact: string;

  constructor(
    public launchNavigator: LaunchNavigator,
    public navCtrl: NavController,
    public platform: Platform) { }

  ngOnChanges() {
    if (this.input) {
      this.contact = `tel:${this.input.details.contact}`;
    }
  }

  navigateToRestaurant() {
    const res = this.input;

    if (this.navCtrl.getActive().instance instanceof TicketQrPage) {
      this.navCtrl.push('RestaurantPage', {
        restaurantId: res._id
      });
    } else {
      this.navCtrl.parent.parent.push('RestaurantPage', {
        restaurantId: res._id,
        restaurantType: res.details.restaurantType
      });
    }
  }

  stopPropagation() {
    event.stopPropagation();
  }

  navigateToLocation() {
    event.stopPropagation();
    if (this.platform.is('cordova')) {
      this.launchNavigator.navigate(this.input.details.fullAddress).then().catch();
    }
  }
}
