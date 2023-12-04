import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController, Platform } from 'ionic-angular';
import { ReservationRequestPage } from '../reservation-request/reservation-request';
import { UserService } from './../../providers/user/user.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Vibration } from '@ionic-native/vibration';
import { CommonService } from './../../providers/common/common.service';
import { SoundService } from '../../providers/data-service/sound.service';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-reservation-status',
  templateUrl: 'reservation-status.html',
})
export class ReservationStatusPage {

  // Params received
  restaurantId: any;
  restaurantName: any;
  notificationId: any;
  reservation: any;
  view: any;
  status: string;

  // Parameters to components
  main: any;
  reservationDetails: any;
  reservationButton: any;

  backSub: any;

  // Controller
  inReservationRequestPage: boolean;

  constructor(
    public alertCtrl: AlertController,
    public events: Events,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserService,
    public vibration: Vibration,
    public platform: Platform,
    public commonService: CommonService,
    public soundService: SoundService) { }

  ngOnInit() {
    this.restaurantId = this.navParams.get('restaurantId');
    this.restaurantName = this.navParams.get('restaurantName');
    this.notificationId = this.navParams.get('notificationId');
    this.reservation = this.navParams.get('reservation');
    this.view = this.navParams.get('view');
    this.inReservationRequestPage = this.view instanceof ReservationRequestPage;
    this.status = this.navParams.get('status');
    this.setUpReservationDetails();
    this.listenNotification();
    this.registerBackButton();
  }

  ngOnDestroy() {
    this.events.unsubscribe('R');
    if (this.backSub) {
      this.backSub();
    }
  }

  private setUpReservationDetails() {
    if (this.inReservationRequestPage) {
      this.userService.getReservationDetails(this.notificationId).pipe(untilDestroyed(this)).subscribe(val => {
        const co = val.content;
        const re = co.reservationDetails;
        this.reservationDetails = {
          restaurantName: co.restaurantName,
          name: re.name,
          contact: re.contact,
          pax: re.pax,
          dateTime: re.dateTime,
          remark: re.remark,
        };
        this.reservationButton = {
          status: co.status,
          restaurantId: this.restaurantId,
          notificationId: this.notificationId
        };
        this.main = {
          status: co.status,
          adminReason: co.adminReason,
          userReason: co.userReason
        };
      });
    } else {
      this.reservationDetails = {
        restaurantName: this.restaurantName,
        name: this.reservation.name,
        contact: this.reservation.contact,
        pax: this.reservation.pax,
        dateTime: this.reservation.dateTime,
        remark: this.reservation.remark,
      };
      this.reservationButton = {
        status: 'PD',
        restaurantId: this.restaurantId,
        notificationId: this.notificationId
      };
      this.main = {
        status: 'PD'
      };
    }
  }

  private listenNotification() {
    if (this.status !== 'PD') {
      return;
    }
    this.events.subscribe('R', msg => {
      if (msg.content.notificationId === this.notificationId) {
        this.soundService.playSound();
        this.vibration.vibrate([100, 100, 100]);

        this.main = {
          status: msg.content.status,
          msg: msg
        };
        this.alertCtrl.create({
          title: msg.title,
          subTitle: msg.body,
          buttons: [
            {
              text: 'Got it',
              handler: () => {
                if (msg.content.status === 'AC') {
                  this.commonService.presentToast('Table reserved and saved in Ticket Page');
                }
                this.back();
              }
            },
          ]
        }).present();
      }
    });
  }

  private registerBackButton() {
    if (this.platform.is('android') || this.platform.is('windows')) {
      this.backSub = this.platform.registerBackButtonAction(() => {
        this.back();
      }, 1);
    }
  }

  back() {
    if (this.inReservationRequestPage) {
      this.navCtrl.pop();
    } else {
      this.navCtrl.pop().then(() => this.navCtrl.pop());
    }
  }
}
