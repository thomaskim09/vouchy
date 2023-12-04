import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { AuthenticationService } from '../../../providers/authentication/authentication.service';
import { CommonService } from '../../../providers/common/common.service';

@Component({
  selector: 'history-order-button',
  templateUrl: 'history-order-button.html'
})
export class HistoryOrderButtonComponent {

  @Input('menu') menu: any;
  @Input('orderContent') orderContent: any;

  // Output to orderDetails
  @Output() response = new EventEmitter<any>();

  // Cleaner code
  orderCon: any;
  bill: any;
  order: any;

  // HTML properties
  takeAwayCounter: number = 0;
  subTotal: any;
  taxCharge: any;
  serviceCharge: any;
  packagingFee: any;
  rounding: any = {};
  totalPrice: any;
  finalTotalPrice: any;

  // Controller
  itemOpened: boolean = false;

  constructor(
    public modalCtrl: ModalController,
    public authenticationService: AuthenticationService,
    public commonService: CommonService) { }

  ngOnChanges() {
    if (this.orderContent && this.menu) {
      this.orderCon = this.orderContent.itemContent;
      this.bill = this.orderCon.billDetails;
      this.order = this.orderCon.orderDetails;
      this.getTakeAwayCounter();
      this.setUpDefaultConfirmDetail();
      this.setUpConfirmDetails();
      this.finalTotalPrice = this.getTotalPrice();
    }
  }

  private getTakeAwayCounter() {
    this.order.map(val => {
      if (val.needTakeAway || this.bill.needTakeAway || !this.bill.isDineIn) {
        this.takeAwayCounter += val.quantity;
      }
    });
  }

  private setUpDefaultConfirmDetail() {
    this.subTotal = this.bill.subTotal;
    this.taxCharge = this.bill.taxCharge;
    this.packagingFee = this.bill.packagingFee;
    this.rounding['type'] = this.bill.roundingType;
    this.rounding['value'] = this.bill.roundingAdjustment;
    this.totalPrice = this.bill.totalPrice;
  }

  private setUpConfirmDetails() {
    // Cleaner code
    const me = this.menu.td;
    const bi = this.bill;
    // Initiate
    let subTotal;
    let taxCharge;
    let serviceCharge;
    let packagingFee;
    let totalPrice;
    let totalPriceText;
    let rounding;
    // Calculate subtotal
    subTotal = bi.subTotal;
    if (me.hasTakeAway && me.hasTakeAwayFee) {
      packagingFee = (me.hasTakeAwayPerPackage) ? this.takeAwayCounter * me.takeAwayFee : me.takeAwayFee;
    }
    // Calculate taxCharge
    if (me.hasTax) {
      taxCharge = this.roundUpPrice((subTotal + this.zero(packagingFee)) * (me.taxPercentage / 100));
    }
    // Calculate serviceCharge
    if (me.hasServiceCharge) {
      serviceCharge = this.roundUpPrice((subTotal + this.zero(packagingFee)) * (me.serviceChargePercentage / 100));
    }
    // Calculate rounding and totalPrice
    totalPrice = this.roundUpPrice(subTotal + this.zero(taxCharge) + this.zero(serviceCharge) + this.zero(packagingFee));
    totalPriceText = (totalPrice).toFixed(2);
    rounding = this.getRoundingAdjustment(totalPriceText);
    if (rounding.value !== '0') {
      totalPrice = parseFloat(totalPriceText);
    } else if (rounding.type === '+') {
      totalPrice += parseFloat(rounding.value);
    } else if (rounding.type === '-') {
      totalPrice -= parseFloat(rounding.value);
    }
    // Display to HTML
    this.totalPrice = totalPrice.toFixed(2);
    this.subTotal = subTotal.toFixed(2);
    this.taxCharge = me.hasTax ? taxCharge.toFixed(2) : undefined;
    this.serviceCharge = me.hasServiceCharge ? serviceCharge.toFixed(2) : undefined;
    this.packagingFee = (me.hasTakeAway && me.hasTakeAwayFee) ? packagingFee.toFixed(2) : undefined;
    this.rounding = rounding;
  }

  toggleList() {
    this.itemOpened = !this.itemOpened;
  }

  private getRoundingAdjustment(price) {
    const last = price.slice(-1);
    switch (last) {
      case '1': return { value: '0.01', type: '-' };
      case '2': return { value: '0.02', type: '-' };
      case '3': return { value: '0.02', type: '+' };
      case '4': return { value: '0.01', type: '+' };
      case '5': return { value: '0', type: '' };
      case '6': return { value: '0.01', type: '-' };
      case '7': return { value: '0.02', type: '-' };
      case '8': return { value: '0.02', type: '+' };
      case '9': return { value: '0.01', type: '+' };
      case '0': return { value: '0', type: '' };
    }
  }

  private zero(value) {
    return value || 0;
  }

  private roundUpPrice(value) {
    return Math.round((value + 0.00001) * 100) / 100;
  }

  private getTotalPrice() {
    if (this.orderCon) {
      if (this.orderCon.responseDetails) {
        return `RM ${this.orderCon.responseDetails.totalPrice.toFixed(2)}`;
      } else {
        return `RM ${this.bill.totalPrice.toFixed(2)}`;
      }
    }
  }
}
