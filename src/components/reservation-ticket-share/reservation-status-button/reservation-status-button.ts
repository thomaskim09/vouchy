import { AlertController } from 'ionic-angular';
import { AuthenticationService } from '../../../providers/authentication/authentication.service';
import { CacheService } from 'ionic-cache';
import { CommonService } from '../../../providers/common/common.service';
import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { RestaurantService } from '../../../providers/restaurant/restaurant.service';
import { TicketQrPage } from '../../../pages/ticket-qr/ticket-qr';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'reservation-status-button',
  templateUrl: 'reservation-status-button.html'
})
export class ReservationStatusButtonComponent {

  @Input('reservationButton') input: any;

  view: any;
  needButton: any;
  currentUser: any;
  inTicketQrPage: boolean;
  buttonText: string;

  // Controller
  needSpinner: boolean = false;

  constructor(
    public alertCtrl: AlertController,
    public authenticationService: AuthenticationService,
    public cacheService: CacheService,
    public commonService: CommonService,
    public navCtrl: NavController,
    public restaurantService: RestaurantService) { }

  ngOnChanges() {
    if (this.input) {
      this.view = this.navCtrl.getActive().instance;
      this.inTicketQrPage = this.view instanceof TicketQrPage;
      this.buttonText = this.inTicketQrPage ? 'Cancel Reservation' : 'Cancel Request';
      this.needButton = this.inTicketQrPage ? this.input.status !== 'CC' : this.input.status === 'PD';
      this.currentUser = this.authenticationService.currentUserValue;
    }
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  cancelReservation() {
    if (this.inTicketQrPage) {
      this.cancelAfterApproved();
    } else {
      this.cancelWhileWaiting();
    }
  }

  private cancelWhileWaiting() {
    this.alertCtrl.create({
      title: 'Confirm cancel?',
      subTitle: 'How about give them some time? The restaurant could be busy right now.',
      buttons: [
        {
          text: 'Back',
          role: 'cancel',
        },
        {
          text: 'Cancel Request',
          handler: () => {
            this.changeStatus(this.input.notificationId, 'CC');
          }
        }
      ]
    }).present();
  }

  private cancelAfterApproved() {
    this.alertCtrl.create({
      title: 'Confirm cancel?',
      subTitle: `Restaurant will be so sad to see you cancel your booked table. But if you do, we could let them know the reason to improve :)`,
      inputs: [
        {
          name: 'reason',
          placeholder: 'Reason',
          max: 50
        }],
      buttons: [
        {
          text: 'Back',
          role: 'cancel',
        },
        {
          text: 'Confirm',
          handler: data => {
            if (data.reason) {
              this.changeStatus(this.input.notificationId, 'CT', data.reason);
            } else {
              this.commonService.presentToast(`Please specify a reason :)`);
              return false;
            }
          }
        }]
    }).present();
  }

  private changeStatus(id, status, reason?) {
    const object = {
      status: status,
      userId: this.currentUser._id,
      restaurantId: this.input.restaurantId,
      username: this.currentUser.username,
      ticketId: this.input.ticketId,
      reason: reason
    };
    this.needSpinner = true;
    this.restaurantService.checkReservation(id, status).pipe(untilDestroyed(this)).subscribe(val => {
      this.restaurantService.cancelReservation(id, object).pipe(untilDestroyed(this)).subscribe(val2 => {
        this.commonService.presentToast('Reservation cancelled');
        this.needSpinner = false;
        this.needButton = false;
        this.pageNavigator();
      });
    }, err => {
      this.alertCtrl.create({
        title: 'Reservation status updated',
        subTitle: err.error.message,
        buttons: [
          {
            text: 'Got It',
            handler: () => {
              this.needSpinner = false;
              this.needButton = false;
              this.pageNavigator();
              this.cacheService.clearGroup(this.restaurantService.reservationRequestCacheKey);
              this.cacheService.clearGroup(this.restaurantService.reservationDetailCacheKey + id);
            }
          }]
      }).present();
    });
  }

  private pageNavigator() {
    if (this.inTicketQrPage) {
      this.navCtrl.pop();
    } else {
      this.navCtrl.pop().then(() => this.navCtrl.pop());
    }
  }
}
