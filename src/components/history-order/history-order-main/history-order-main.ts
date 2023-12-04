import { Component, Input } from '@angular/core';
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'history-order-main',
  templateUrl: 'history-order-main.html'
})
export class HistoryOrderMainComponent {

  @Input('menu') menu: any;
  @Input('itemContent') itemCon: any;
  @Input('responseDetails') res: any;

  // Main content properties
  orderList: any;
  tableNo: string;
  collectTime: string;
  isDineIn: boolean;
  needTakeAway: boolean;
  orderTime: any;

  constructor() { }

  ngOnChanges() {
    if (this.itemCon && this.menu) {
      this.setUpFormula();
    }
  }

  private setUpFormula() {
    this.setUpOrderList();
    this.needTakeAway = this.itemCon.billDetails.needTakeAway;
    this.orderTime = this.removeTimeZero(format(parseISO(this.itemCon.createdTime), 'hh:mma'));
    this.setUpResponseDetails();
    this.tableNo = this.itemCon.billDetails.tableNo;
    this.collectTime = this.itemCon.billDetails.collectTime;
    this.isDineIn = this.itemCon.billDetails.isDineIn;
  }

  private removeTimeZero(value) {
    let result = value;
    if (result.charAt(0) === '0') {
      result = result.substr(1);
    }
    return result;
  }

  private setUpOrderList() {
    this.orderList = this.itemCon.orderDetails.map(val => {
      if (val.remarkObject) {
        const itemRemarks = val.remarkObject.map(val2 => {
          const result = val2.children.map(val3 => ({
            remarkName: val3.name,
            remarkPrice: val3.price
          }));
          return result[0];
        });
        return {
          itemQuantity: val.quantity,
          itemName: val.itemName,
          itemPrice: val.itemPrice,
          needTakeAway: val.needTakeAway,
          takeAwayFee: this.getTakeAwayFee(),
          itemRemarks: itemRemarks,
          extraRemark: val.extraRemark
        };
      } else {
        return {
          itemQuantity: val.quantity,
          itemName: val.itemName,
          itemPrice: val.itemPrice,
          needTakeAway: val.needTakeAway,
          takeAwayFee: this.getTakeAwayFee(),
          extraRemark: val.extraRemark
        };
      }
    });
  }

  private getTakeAwayFee() {
    if (this.menu.td.hasTakeAway && this.menu.td.hasTakeAwayFee) {
      return (this.menu.td.hasTakeAwayPerPackage) ? this.menu.td.takeAwayFee.toFixed(2) : '-';
    } else {
      return '-';
    }
  }

  private setUpResponseDetails() {
    if (this.itemCon.status !== 'PC' && this.itemCon.status !== 'CF') {
      if (this.res) {
        if (this.res.description) {
          this.setUpResDetails(this.res);
        }
      }
    }
  }

  private setUpResDetails(res) {
    if (this.res) {
      this.res = {
        hasResponseDetails: true,
        description: res.description,
        newSubTotal: res.subTotal.toFixed(2),
        amountType: res.amountType,
        descriptionPrice: res.amountPrice.toFixed(2),
        newPackagingFee: this.zero(res.packagingFee).toFixed(2),
        newTaxCharge: this.zero(res.taxCharge).toFixed(2),
        newServiceCharge: this.zero(res.serviceCharge).toFixed(2),
        newRoundingType: res.roundingType,
        newRoundingValue: res.roundingAdjustment.toFixed(2),
        newTotalPrice: res.totalPrice.toFixed(2),
      };
    }
  }

  private zero(value) {
    return value || 0;
  }

  getPrice(price) {
    return price === 0 ? '-' : price.toFixed(2);
  }

}
