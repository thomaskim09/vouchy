import { Component, Input } from '@angular/core';

@Component({
  selector: 'voucher-detail-info',
  templateUrl: 'voucher-detail-info.html'
})
export class VoucherDetailInfoComponent {

  @Input('voucherInfo') input: any;

  quantityLeft: number;
  stillCanPurchase: number;

  constructor() { }

  ngOnChanges() {
    if (this.input) {
      this.checkLimitPerUser(this.input);
    }
  }

  private checkLimitPerUser(input) {
    this.quantityLeft = input.limitedQuantity - input.quantitySold;
    if (input.userPurchaseHistory) {
      this.stillCanPurchase = input.limitedQuantityPerUser - input.userPurchaseHistory[0].quantityPurchased;
      if (input.limitedQuantity) {
        if (this.stillCanPurchase > this.quantityLeft) {
          this.stillCanPurchase = this.quantityLeft;
        }
      }
    }
  }

}
