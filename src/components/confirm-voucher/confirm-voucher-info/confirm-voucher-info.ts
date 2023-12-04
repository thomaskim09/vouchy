import { Component, Input } from '@angular/core';

@Component({
  selector: 'confirm-voucher-info',
  templateUrl: 'confirm-voucher-info.html'
})
export class ConfirmVoucherInfoComponent {

  @Input('confirmVoucherInfo') input: any;

  quantityLeft: number;
  stillCanPurchase: number;

  constructor() { }

  ngOnChanges() {
    if (this.input) {
      const ip = this.input; // neater code

      this.quantityLeft = ip.limitedQuantity - ip.quantitySold;
      if (ip.userPurchaseHistory) {
        this.stillCanPurchase = ip.limitedQuantityPerUser - ip.userPurchaseHistory[0].quantityPurchased;
        if (ip.limitedQuantity) {
          if (this.stillCanPurchase > this.quantityLeft) {
            this.stillCanPurchase = this.quantityLeft;
          }
        }
      }
    }
  }

}
