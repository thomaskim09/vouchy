import { Component, Input } from '@angular/core';
import { DataService } from '../../../providers/data-service/data.service';

@Component({
  selector: 'confirm-voucher-control',
  templateUrl: 'confirm-voucher-control.html'
})
export class ConfirmVoucherControlComponent {

  @Input('confirmVoucherControl') input: any;

  quantity: number = 1;
  totalVoucherPrice: number;
  totalGroupPrice: number;
  initialSave: number;
  valueSave: number;
  quantityLeftToFirstGroup: number;
  stillCanPurchase: number;

  constructor(public dataService: DataService) { }

  ngOnChanges() {
    if (this.input) {
      // Cleaner code
      const de = this.input;

      this.totalVoucherPrice = de.newPrice;
      this.totalGroupPrice = de.newPrice;
      if (this.input.groupVoucherDetails) {
        this.calculateTotalGroupPrice(de.newPrice, de.groupVoucherDetails);
      }
      this.stillCanPurchase = this.checkStillCanPurchase();
    }
  }

  private checkStillCanPurchase() {
    // Cleaner code
    const de = this.input;
    const LQ = de.limitedQuantity;
    const LQPU = de.limitedQuantityPerUser;
    const UPH = de.userPurchaseHistory;
    const QS = de.quantitySold;

    if (LQ && LQPU && UPH) { // Two limit for old user
      return this.calculateStillCanPurchase(LQ, QS, LQPU, UPH[0].quantityPurchased);
    } else if (!LQ && LQPU && UPH) { // For old user
      return this.calculateStillCanPurchase(LQ, QS, LQPU, UPH[0].quantityPurchased);
    } else if (LQ && LQPU && !UPH) { // Two limits for new user
      return this.calculateStillCanPurchase(LQ, QS, LQPU);
    } else if (LQ && !LQPU && !UPH) { // Only limit quantity for new user
      return this.calculateStillCanPurchase(LQ, QS);
    } else if (!LQ && LQPU && !UPH) { // Only limit per user for new user
      return LQPU;
    }
  }

  private calculateStillCanPurchase(limitedQuantity = 0, quantitySold = 0, limitedQuantityPerUser = 0, quantityPurchased = 0) {
    const left = limitedQuantity - quantitySold;
    const right = limitedQuantityPerUser - quantityPurchased;
    return (right === 0 || left <= right) ? left : right;
  }

  subtractQuantity() {
    const ip = this.input;

    if (this.quantity > 1) {
      if (ip.groupVoucherDetails) {
        this.quantity--;
        const newPricePerUnit = this.calculateTotalGroupPrice(ip.newPrice, ip.groupVoucherDetails);
        this.updateContent(newPricePerUnit, this.totalGroupPrice);
      } else {
        this.quantity--;
        this.totalVoucherPrice = this.roundUpPrice(this.quantity * ip.newPrice);
        this.updateContent(ip.newPrice, this.totalVoucherPrice);
      }
    }
  }

  addQuantity() {
    const ip = this.input;

    if (ip.groupVoucherDetails) {
      this.quantity++;
      const newPricePerUnit = this.calculateTotalGroupPrice(ip.newPrice, ip.groupVoucherDetails);
      this.updateContent(newPricePerUnit, this.totalGroupPrice);
    } else if (ip.limitedQuantity || ip.limitedQuantityPerUser) {
      if (this.quantity < this.stillCanPurchase) {
        this.quantity++;
        this.totalVoucherPrice = this.roundUpPrice(this.quantity * ip.newPrice);
        this.updateContent(ip.newPrice, this.totalVoucherPrice);
      }
    } else if (!ip.groupVoucherDetails && !ip.limitedQuantity && !ip.limitedQuantityPerUser) {
      this.quantity++;
      this.totalVoucherPrice = this.roundUpPrice(this.quantity * ip.newPrice);
      this.updateContent(ip.newPrice, this.totalVoucherPrice);
    }
  }

  private updateContent(newPrice, totalPrice) {
    this.dataService.changeConfirmContent({
      quantity: this.quantity,
      newPricePerUnit: newPrice,
      totalPrice: totalPrice
    });
  }

  private calculateTotalGroupPrice(newPrice, groupDetails) {
    const arrayResult = groupDetails.map(val => {
      if (this.quantity >= val.groupQuantity) {
        this.totalGroupPrice = this.roundUpPrice(this.quantity * val.groupPricePerUnit);
        this.valueSave = this.roundUpPrice(this.quantity * (newPrice - val.groupPricePerUnit));
        return val.groupPricePerUnit;
      } else if (this.quantity < groupDetails[0].groupQuantity) {
        this.totalGroupPrice = this.roundUpPrice(this.quantity * newPrice);
        this.initialSave = this.roundUpPrice(groupDetails[0].groupQuantity * (newPrice - groupDetails[0].groupPricePerUnit));
        this.quantityLeftToFirstGroup = groupDetails[0].groupQuantity - this.quantity;
        return newPrice;
      }
    });
    const filteredArray = arrayResult.filter(val => val !== undefined);
    return Math.min(...filteredArray);
  }

  private roundUpPrice(value) {
    return Math.round((value + 0.00001) * 100) / 100;
  }

}
