import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-payment-method',
  templateUrl: 'payment-method.html',
})
export class PaymentMethodPage {

  // HTML properties
  type: string;
  tableNo: string;
  needTakeAway: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController) { }

  ngOnInit() {
    this.type = this.navParams.get('type');
    this.tableNo = this.navParams.get('tableNo');
    this.needTakeAway = this.navParams.get('needTakeAway');
  }

  getStatusText() {
    switch (this.type) {
      case 'Treat': return 'Hint: Gaining e-wallet point could save money too :)';
      default: return 'Hint: Gaining e-wallet point could save money too :)';
    }
  }

  isCashless() {
    switch (this.type) {
      case 'Treat': return true;
      default: return false;
    }
  }

  isCash() {
    switch (this.type) {
      case 'Treat': return false;
      default: return true;
    }
  }

  choosePayment(type) {
    this.viewCtrl.dismiss({
      paymentMethod: type
    });
  }

  close() {
    this.viewCtrl.dismiss({
      paymentMethod: undefined
    });
  }
}
