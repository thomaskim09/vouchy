import { CommonService } from '../../providers/common/common.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { RestaurantService } from '../../providers/restaurant/restaurant.service';
import { UserService } from '../../providers/user/user.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { format, parseISO } from 'date-fns';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-ticket-qr',
  templateUrl: 'ticket-qr.html',
})
export class TicketQrPage {

  ticketId: any;
  restaurantId: any;
  restaurantName: any;
  type: string;

  input: string;
  needRefresher: boolean = true;
  isExpired: boolean = false;
  ticketName: string;
  status: string;
  voucherType: string;
  restaurantDetails: any;

  // Components input
  ticketMain: any;
  ticketPurchase: any;
  voucherQuantity: any;
  voucherCash: any;
  voucherContent: any;
  voucherMonthly: any;
  voucherRules: any;
  reservationDetails: any;
  reservationButton: any;

  // Controller
  refresher: any;
  refresherTimer: any;

  constructor(
    public commonService: CommonService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public restaurantService: RestaurantService,
    public userService: UserService,
    public alertCtrl: AlertController) {
  }

  ngOnInit() {
    this.ticketId = this.navParams.get('ticketId');
    this.restaurantId = this.navParams.get('restaurantId');
    this.restaurantName = this.navParams.get('restaurantName');
    this.isExpired = this.navParams.get('isExpired');
    // Check status
    this.status = this.navParams.get('status');
    this.needRefresher = this.checkPageByStatus(this.status);
    this.type = this.checkType(this.status);
    // Set up
    this.setUpTicketDetails();
    this.setUpRestaurantDetails();
    const notificationId = this.navParams.get('notificationId');
    this.checkIfNeedReservationButton(notificationId, status);
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    clearTimeout(this.refresherTimer);
  }

  private setUpTicketDetails() {
    this.userService.getTicketDetails(this.ticketId, this.type).pipe(untilDestroyed(this)).subscribe(val => {
      if (val && val.length) {
        this.assignToComponents(val[0]);
      }
      if (this.refresher) { this.refresher.complete(); }
    }, error => {
      this.commonService.presentToast('Server is not responding');
      if (this.refresher) { this.refresher.complete(); }
    });
  }

  private setUpRestaurantDetails() {
    this.restaurantService.getRestaurantDetailsSegment(this.restaurantId, 'segment').pipe(untilDestroyed(this)).subscribe(val => {
      this.restaurantDetails = val;
    });
  }

  private checkIfNeedReservationButton(notificationId, status) {
    if (!notificationId && status !== 'RE') {
      return;
    }
    this.restaurantService.checkReservationNotification(notificationId).pipe(untilDestroyed(this)).subscribe(val => {
      if (val === 'CT' || val === 'CL') {
        this.alertCtrl.create({
          title: 'Please refresh',
          subTitle: 'You have cancelled reservation, please refresh list',
          enableBackdropDismiss: false,
          buttons: [
            {
              text: 'Okay',
              handler: () => {
                this.back();
              }
            }]
        }).present();
      }
    });
  }

  private refreshTicketQuantity() {
    this.userService.getTicketQuantity(this.ticketId).pipe(untilDestroyed(this)).subscribe(val => {
      this.ticketMain = this.processTicketMainVoucher(val);
      if (this.refresher) { this.refresher.complete(); }
    }, error => {
      this.commonService.presentToast('Server is not responding');
      if (this.refresher) { this.refresher.complete(); }
    });
  }

  private checkType(status) {
    switch (status) {
      case 'PU':
      case 'HV': return 'voucher';
      case 'RE':
      case 'HR': return 'reservation';
    }
  }

  doRefresh(refresher) {
    this.refresher = refresher;
    this.refreshTicketQuantity();
    // Refresher Timeout
    clearTimeout(this.refresherTimer);
    this.refresherTimeOut(refresher);
  }

  private refresherTimeOut(refresher) {
    this.refresherTimer = setTimeout(() => {
      if (refresher.state === 'refreshing') {
        this.commonService.presentToast('Request time out');
        refresher.complete();
      }
    }, 3000);
  }

  private processTicketMainVoucher(val) {
    return {
      ticketId: val._id,
      ticketCode: val.ticketCode,
      claimed: val.claimed,
      quantity: val.purchaseDetails.quantity,
      quantityUnit: val.voucherDetails.quantityUnit,
      expiredDate: val.expiredDate,
      isExpired: this.isExpired,
      needQr: this.checkIfNeedQr(this.status),
      voucherType: this.voucherType,
      type: 'voucher'
    };
  }

  private assignToComponents(val) {
    this.input = val;
    const ip = val; // Neater code
    this.status = ip.status;

    if (ip.voucherId) {
      const de = ip.voucherDetails; // Neater code

      this.ticketName = de.voucherName;
      this.voucherType = de.voucherType;

      this.ticketMain = this.processTicketMainVoucher(ip);
      this.needRefresher = this.checkIfNeedRefresher(this.ticketMain);

      // Purchase information
      const pu = ip.purchaseDetails;
      this.ticketPurchase = {
        purchaseTime: this.getDate(pu.purchaseTime),
        paymentMethod: this.getPaymentMethod(pu.paymentMethod),
        pricePerUnit: pu.pricePerUnit,
        paymentOffer: pu.paymentOffer,
        quantity: pu.quantity,
      };
      // Rules
      this.voucherRules = de.voucherRules;

      switch (de.voucherType) {
        case 'SV':
          this.voucherContent = {
            setDetails: de.setDetails,
          };
          break;
        case 'CV':
          this.voucherCash = {
            basePrice: de.basePrice,
            minimumSpend: de.minimumSpend,
          };
          break;
        case 'QV':
          this.voucherQuantity = {
            quantityUnit: de.quantityUnit,
            quantityDetails: de.quantityDetails,
          };
          break;
        case 'MV':
          this.voucherMonthly = {
            limitPerDay: de.limitPerDay,
            monthlyDetails: de.monthlyDetails,
            monthlyExpiryDate: this.getDate(pu.monthlyExpiryDate)
          };
          break;
      }
    }
    // Reservation
    if (ip.reservationDetails) {
      const de = ip.reservationDetails;

      this.ticketName = this.restaurantName;
      this.ticketMain = {
        ticketId: this.ticketId,
        encodeText: ip.encodeText,
        ticketCode: ip.ticketCode,
        expiredDate: ip.expiredDate,
        needQr: this.checkIfNeedQr(this.status),
        type: 'reservation'
      };
      this.reservationDetails = {
        restaurantName: this.restaurantName,
        name: de.name,
        contact: de.contact,
        pax: de.pax,
        dateTime: de.dateTime,
        remark: de.remark,
      };
      this.reservationButton = {
        ticketId: this.ticketId,
        restaurantId: this.restaurantId,
        notificationId: de.notificationId,
        status: ip.status
      };
    }
  }

  private getDate(time) {
    return format(parseISO(time), 'dd-MM-yyyy (hh:mm a)');
  }

  private getPaymentMethod(method) {
    switch (method) {
      case 'BOOST': return 'Boost';
      case 'TNG-EWALLET': return `Touch'n Go`;
      case 'fpx': return 'Online Banking';
    }
  }

  private checkIfNeedQr(status) {
    return (status === 'PU' || status === 'RE');
  }

  private checkPageByStatus(status) {
    return status === 'PU' ? true : false;
  }

  private checkIfNeedRefresher(input) {
    const ip = input;
    if (this.isExpired) {
      return false;
    } else if (ip.voucherType === 'MV') {
      return true;
    } else {
      const quantityLeft = (ip.quantityUnit) ? (ip.quantity * ip.quantityUnit) - ip.claimed : ip.quantity - ip.claimed;
      return (quantityLeft !== 1 && ip.type === 'voucher');
    }
  }

  back() {
    this.navCtrl.pop();
  }

}
