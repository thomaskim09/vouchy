import lo_isEmpty from 'lodash/isEmpty';
import { Component, Input } from '@angular/core';
import { DataService } from '../../../providers/data-service/data.service';
import { UserService } from '../../../providers/user/user.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'confirm-voucher-main',
  templateUrl: 'confirm-voucher-main.html'
})
export class ConfirmVoucherMainComponent {

  @Input('confirmVoucherMain') input: any;

  quantity: number = 1;
  newPricePerUnit: number;

  constructor(
    public userProvider: UserService,
    public dataService: DataService) { }

  ngOnInit() {
    this.listenConfirmContent();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private listenConfirmContent() {
    this.dataService.currentConfirmContent.pipe(untilDestroyed(this)).subscribe(val => {
      if (!lo_isEmpty(val)) {
        if (!val.paymentMethod) {
          this.quantity = val.quantity;
          this.newPricePerUnit = val.newPricePerUnit;
        }
      }
    });
  }

}
