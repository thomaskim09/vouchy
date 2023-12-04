import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { RestaurantService } from '../../providers/restaurant/restaurant.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { DataService } from '../../providers/data-service/data.service';
import { Platform } from 'ionic-angular/platform/platform';
import { UserService } from './../../providers/user/user.service';
import { CommonService } from './../../providers/common/common.service';
import { environment } from './../../providers/environments/environments';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-payment-ui',
  templateUrl: 'payment-ui.html',
})
export class PaymentUiPage {

  // Common params
  paymentDetails: any;

  // Params from confirmVoucher
  ticketDetails: any;
  ticketType: string;

  // Params from coffee pay
  treatDetails: any;
  type: any;

  // Controller
  failCounter: number = 0;

  // Tools
  backSub: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public restaurantService: RestaurantService,
    public dataService: DataService,
    public events: Events,
    public platform: Platform,
    public userService: UserService,
    public commonService: CommonService) {
  }

  ngOnInit() {
    this.paymentDetails = this.navParams.get('paymentDetails');
    this.ticketDetails = this.navParams.get('ticketDetails');
    this.ticketType = this.navParams.get('ticketType');
    this.treatDetails = this.navParams.get('treatDetails');
    this.type = this.navParams.get('type');
    this.registerBackButton();
    this.setUpDifferently();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    if (this.backSub) {
      this.backSub();
    }
  }

  private setUpDifferently() {
    // For demo testing purpose uncomment this after demo
    // if (!this.platform.is('cordova')) {
    //   return;
    // }
    switch (this.type) {
      case 'voucher': {
        if (this.ticketType === 'full') {
          this.startTicketPaymentFull();
        } else {
          this.startTicketPaymentHalf();
        }
        break;
      }
      case 'treat': {
        this.startTreatPayment();
        break;
      }
    }
  }

  private startTicketPaymentHalf() {
    // For demo testing purpose
    if (!environment.isProd) {
      this.createNewTicket(this.ticketDetails, 'half');
      return;
    }
    (window as any).molpay.startMolpay(this.paymentDetails, val => {
      val = JSON.parse(val);
      if (val.status_code === '00') {
        this.createNewTicket(this.ticketDetails, 'half');
      } else {
        if (this.failCounter === 0) {
          this.updateBackVoucherSold(this.ticketDetails);
          this.failCounter++;
        }
      }
    });
  }

  private startTicketPaymentFull() {
    // For demo testing purpose
    if (!environment.isProd) {
      this.createNewTicket(this.ticketDetails, 'full');
      return;
    }
    (window as any).molpay.startMolpay(this.paymentDetails, val => {
      val = JSON.parse(val);
      if (val.status_code === '00') {
        this.createNewTicket(this.ticketDetails, 'full');
      } else {
        if (this.failCounter === 0) {
          this.backTwice(true);
          this.dataService.changeConfirmContent({});
          this.failCounter++;
        }
      }
    });
  }

  private startTreatPayment() {
    // For demo testing purpose
    if (!environment.isProd) {
      this.createNewTreat(this.treatDetails);
      return;
    }
    (window as any).molpay.startMolpay(this.paymentDetails, val => {
      val = JSON.parse(val);
      if (val.status_code === '00') {
        this.createNewTreat(this.treatDetails);
      } else {
        if (this.failCounter === 0) {
          this.backTwice(true);
          this.failCounter++;
        }
      }
    });
  }

  private createNewTreat(object) {
    this.userService.sendTreats(object).pipe(untilDestroyed(this)).subscribe(val => {
      const text = object.details.isAnonymous ? 'Thank you for the support' : 'Thank you for the support, We will reply you soon :)';
      this.commonService.presentToast(text);
      this.backTwice();
    });
  }

  private createNewTicket(object, type) {
    this.restaurantService.createNewTicketVoucher(object, type).pipe(untilDestroyed(this)).subscribe(val => {
      this.dataService.changeConfirmContent({});
      this.dataService.changeRefreshContent({
        voucherDetailsPage: true,
        voucherId: this.ticketDetails.voucherId,
      });
      this.events.publish('ticketPurchased');
      this.commonService.presentToast('Voucher purchased and saved in Ticket Page');
      this.backTwice();
    });
  }

  private updateBackVoucherSold(ticketDetails) {
    this.restaurantService.updateVoucherSoldOnly(ticketDetails.voucherId, ticketDetails.userId, -ticketDetails.quantity).pipe(untilDestroyed(this)).subscribe(val3 => {
      this.dataService.changeConfirmContent({});
      this.backTwice();
    });
  }

  private registerBackButton() {
    if (this.platform.is('android') || this.platform.is('windows')) {
      this.backSub = this.platform.registerBackButtonAction(() => {
        // Purposely leave blank to ensure no back action
      }, 1);
    }
  }

  private backTwice(failed?) {
    if (failed) {
      this.commonService.presentToast('Transaction unsuccessful');
    }
    this.navCtrl.pop().then(() => this.navCtrl.pop());
  }

  back() {
    if (this.ticketType === 'half') {
      this.updateBackVoucherSold(this.ticketDetails);
    } else {
      this.navCtrl.pop();
    }
  }

}
