import lo_isEmpty from 'lodash/isEmpty';
import { AuthenticationService } from '../../../providers/authentication/authentication.service';
import { Component, Input } from '@angular/core';
import { DataService } from '../../../providers/data-service/data.service';
import { Events, AlertController } from 'ionic-angular';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { RestaurantService } from '../../../providers/restaurant/restaurant.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CommonService } from './../../../providers/common/common.service';
import { keys } from './../../../providers/environments/keys';
import { environment } from './../../../providers/environments/environments';
import { isAfter } from 'date-fns';
import { isBefore, parseISO } from 'date-fns/esm';

@Component({
  selector: 'confirm-voucher-button',
  templateUrl: 'confirm-voucher-button.html'
})
export class ConfirmVoucherButtonComponent {

  @Input('confirmVoucherButton') input: any;

  currentUser: any;
  voucherId: string;
  quantity: number = 1;
  newPricePerUnit: number;
  totalPriceValue: number;
  paymentMethod: string;

  // Controller
  canDirectPurchase: boolean = false;
  needSpinner: boolean = false;

  constructor(
    public alertCtrl: AlertController,
    public commonService: CommonService,
    public authenticationService: AuthenticationService,
    public dataService: DataService,
    public events: Events,
    public navCtrl: NavController,
    public restaurantService: RestaurantService) { }

  ngOnInit() {
    this.currentUser = this.authenticationService.currentUserValue;
    this.listenToPaymentOption();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  ngOnChanges() {
    if (this.input) {
      this.voucherId = this.input.voucherId;
      this.newPricePerUnit = this.input.newPrice;
      this.totalPriceValue = this.input.newPrice;
      this.canDirectPurchase = (this.newPricePerUnit === 0) ? true : this.paymentMethod ? true : false;
    }
  }

  private listenToPaymentOption() {
    this.dataService.currentConfirmContent.pipe(untilDestroyed(this)).subscribe(val => {
      if (!lo_isEmpty(val)) {
        if (val.paymentMethod) {
          this.paymentMethod = val.paymentMethod;
          this.canDirectPurchase = (this.newPricePerUnit === 0) ? true : this.paymentMethod ? true : false;
        } else {
          this.quantity = val.quantity;
          this.newPricePerUnit = val.newPricePerUnit;
          this.totalPriceValue = val.totalPrice;
        }
      }
    });
  }

  confirmPay() {
    if (!this.authenticationService.checkLoginStatus()) {
      this.navCtrl.push('LoginPage', {
        view: this.navCtrl.getActive().instance,
        voucherId: this.voucherId
      });
      return;
    }
    if (!this.canDirectPurchase && !this.paymentMethod) {
      this.commonService.presentToast('Please select a payment method :)');
      return;
    }
    this.needSpinner = true;
    // Check voucher availability front-end
    if (this.checkVoucherAvailable()) {
      return;
    }
    // Check voucher availability back-end
    this.restaurantService.checkVoucherAvailability(this.voucherId, this.currentUser._id, this.quantity).pipe(untilDestroyed(this)).subscribe(val => {
      const paymentDetails = this.preparePaymentObject(this.totalPriceValue, val.ticketId);
      const ticketDetails = this.prepareTicketObject(val.ticketId);
      // Update voucher sold first
      if (this.input.limitedQuantity) {
        this.restaurantService.updateVoucherSoldOnly(this.voucherId, this.currentUser._id, this.quantity).pipe(untilDestroyed(this)).subscribe(val2 => {
          this.handleProcess(paymentDetails, ticketDetails, 'half');
        });
      } else {
        this.handleProcess(paymentDetails, ticketDetails, 'full');
      }
    }, err => this.handleError(err.error.error));
  }

  private handleError(text) {
    this.alertVoucher(text);
    this.needSpinner = false;
  }

  private handleProcess(paymentDetails, ticketDetails, type) {
    // If the voucher is free
    if (this.totalPriceValue === 0) {
      this.restaurantService.checkVoucherFree(this.voucherId).pipe(untilDestroyed(this)).subscribe(val => {
        this.createNewTicket(ticketDetails, type);
      }, err => this.handleError(err.error.error));
      return;
    }
    // Online payment start
    const object = {
      paymentDetails: paymentDetails,
      ticketDetails: ticketDetails,
      ticketType: type,
      type: 'voucher'
    };
    this.navCtrl.push('PaymentUiPage', object);
    this.needSpinner = false;
  }

  private alertVoucher(message) {
    this.alertCtrl.create({
      title: 'Our apologies :(',
      subTitle: message,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Got It',
          handler: data => {
            this.navCtrl.pop();
          }
        }
      ]
    }).present();
  }

  private preparePaymentObject(amount, orderId) {
    const needDevMode = environment.isProd ? false : true;
    const key = environment.isProd ? keys.molpay : keys.molpayDev;
    const description = `${this.input.voucherDetails.voucherName} - ${this.quantity} unit (${this.input.restaurantName})`;
    return {
      mp_dev_mode: needDevMode,
      mp_username: key.username,
      mp_password: key.password,
      mp_merchant_ID: key.merchantId,
      mp_app_name: key.appName,
      mp_verification_key: key.verificationKey,
      mp_amount: amount,
      mp_order_ID: orderId,
      mp_currency: 'MYR',
      mp_country: 'MY',
      mp_channel: this.paymentMethod,
      mp_bill_description: description,
      mp_bill_name: this.currentUser.username,
      mp_bill_email: this.currentUser.email,
      mp_bill_mobile: this.currentUser.contact,
      mp_channel_editing: false,
      mp_bill_name_edit_disabled: true,
      mp_bill_mobile_edit_disabled: true,
      mp_bill_email_edit_disabled: true,
      mp_bill_description_edit_disabled: true,
      mp_disabled_channels: ['cash', 'credit']
    };
  }

  private prepareTicketObject(ticketId) {
    return {
      ticketId: ticketId,
      restaurantId: this.input.restaurantId,
      restaurantList: this.input.restaurantList,
      userId: this.currentUser._id,
      quantity: this.quantity,
      pricePerUnit: this.newPricePerUnit,
      paymentMethod: this.input.newPrice === 0 ? undefined : this.paymentMethod,
      voucherId: this.voucherId,
      voucherDetails: this.input.voucherDetails,
      username: this.currentUser.username,
      isLimitedQuantityPerUser: this.checkExist(this.input.limitedQuantityPerUser),
      isPurchasedBefore: this.checkExist(this.input.userPurchaseHistory),
    };
  }

  private createNewTicket(object, type) {
    this.restaurantService.createNewTicketVoucher(object, type).pipe(untilDestroyed(this)).subscribe(val => {
      this.pageNavigator();
      this.needSpinner = false;
    });
  }

  private pageNavigator() {
    this.dataService.changeConfirmContent({});
    this.dataService.changeRefreshContent({
      voucherDetailsPage: true,
      voucherId: this.voucherId,
    });
    this.events.publish('ticketPurchased');
    this.commonService.presentToast('Voucher purchased and saved in Ticket Page');
    this.navCtrl.pop();
  }

  private checkExist(value) {
    return value ? true : false;
  }

  private checkVoucherAvailable() {
    const de = this.input;
    // Check if sold out
    if (de.soldOutTime) {
      this.alertVoucher('Voucher has been sold out');
      return true;
    }
    // Check if sold out user specifically
    if (de.limitedQuantityPerUser && de.userPurchaseHistory) {
      const left = de.limitedQuantityPerUser - de.userPurchaseHistory[0].quantityPurchased;
      if (left < this.quantity) {
        this.alertVoucher('Voucher has exceeded your purchase limit');
        return true;
      }
    }
    // Check if sold out
    if (de.limitedQuantity) {
      if (de.quantitySold >= de.limitedQuantity) {
        this.alertVoucher('Voucher has been sold out');
        return true;
      }
    }
    // Check limited time
    if (de.limitedEndTime) {
      if (isAfter(new Date(), parseISO(de.limitedEndTime))) {
        this.alertVoucher('Voucher has passed limited time');
        return true;
      }
    }
    // Check start time
    if (de.startSellingTime) {
      if (isBefore(new Date(), parseISO(de.startSellingTime))) {
        this.alertVoucher('Voucher is not for sell yet');
        return true;
      }
    }
    // Check expiry date
    if (de.validUntil) {
      if (isAfter(new Date(), parseISO(de.validUntil))) {
        this.alertVoucher('Voucher has expired');
        return true;
      }
    }
    return false;
  }
}
