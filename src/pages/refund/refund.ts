import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-refund',
  templateUrl: 'refund.html',
})
export class RefundPage {

  refundList: any;

  constructor(public navCtrl: NavController) { }

  ngOnInit() {
    this.setUpRefundList();
  }

  back() {
    this.navCtrl.pop();
  }

  private setUpRefundList() {
    this.refundList = [
      {
        subtitle: `Transactions`,
        content: [
          `(1) All transactions which are conducted are non-refundable in the case of partially used
          cashback or unclaimed purchases. In cases whereby you have been wrongfully billed, a
          "case-to-case" basis approach will be taken in the presence of credible evidence of
          such. Vouchy holds full authority and discretion towards the outcome of such
          circumstances.`,
          `(2) If the store where the ticket was purchased has closed or is no longer open. Vouchers
          purchased will be considered invalid and non-refundable.`,
          `(3) Any vouchers paid after their expiry date will be considered invalid and non-refundable.
          Shopkeepers are free to reject or accept voucher in such cases.`
        ],
      },
      {
        subtitle: `Others`,
        content: [
          `(1) We may cancel this contract if the goods and/or services are not
          available for any reason. For this case, there will be absolutely
          no refund provided.`,
          `(2) Vouchy reserves its right to review any refund of vouchers
          and amend any of the above mentioned terms and conditions from time
          to time.`
        ]
      }
    ];
  }
}
