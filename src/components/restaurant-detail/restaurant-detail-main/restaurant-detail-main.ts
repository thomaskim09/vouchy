import { Component, Input } from '@angular/core';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { NavController, ModalController, AlertController } from 'ionic-angular';
import { Platform } from 'ionic-angular/platform/platform';

@Component({
  selector: 'restaurant-detail-main',
  templateUrl: 'restaurant-detail-main.html'
})
export class RestaurantDetailMainComponent {

  @Input('restaurantDetailMain') input: any;

  constructor(
    public launchNavigator: LaunchNavigator,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public platform: Platform,
    public alertCtrl: AlertController) { }

  presentOrderPicker() {
    const orderParams = {
      restaurantId: this.input.restaurantId,
      restaurantName: this.input.restaurantName,
      orderMode: this.input.orderMode
    };
    this.modalCtrl.create('OrderPickerPage', { orderParams: orderParams }).present();
  }

  goToReservation() {
    if (!this.input.noticeContent) {
      this.navigateReservation();
      return;
    }
    let message = `<ul class='alertList'>`;
    const array = this.input.noticeContent.split(',');
    array.map(val => {
      message += `<li>${val}</li>`;
    });
    message += '</ul>';
    this.alertCtrl.create({
      title: 'Latest Information',
      subTitle: 'Please check this before reserving a table',
      message: message,
      buttons: [
        {
          text: 'Back',
          role: 'cancel',
        },
        {
          text: 'Okay',
          handler: data => {
            this.navigateReservation();
          }
        }
      ]
    }).present();
  }

  private navigateReservation() {
    const object = {
      restaurantId: this.input.restaurantId,
      restaurantName: this.input.restaurantName
    };
    this.navCtrl.push('ReservationPage', object);
  }

  presentCallPicker() {
    this.modalCtrl.create('CallPickerPage', {
      type: 'restaurant',
      contact: this.input.contact
    }).present();
  }

  goToLocation() {
    if (this.platform.is('cordova')) {
      this.launchNavigator.navigate(this.input.fullAddress).then().catch();
    }
  }
}
