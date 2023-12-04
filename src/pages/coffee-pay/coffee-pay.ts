import { AuthenticationService } from '../../providers/authentication/authentication.service';
import { CommonService } from '../../providers/common/common.service';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { UserService } from '../../providers/user/user.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { keys } from '../../providers/environments/keys';
import { environment } from '../../providers/environments/environments';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-coffee-pay',
  templateUrl: 'coffee-pay.html',
})
export class CoffeePayPage {

  // Form
  form: FormGroup;

  // HTML controller
  defaultMethod: string = 'BOOST';
  paymentMethod: string = this.defaultMethod;

  // JS Properties
  type: any;
  value: any;
  currentUser: any;

  // Controller
  needSpinner: boolean = false;

  constructor(
    public authenticationService: AuthenticationService,
    public commonService: CommonService,
    public formBuilder: FormBuilder,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserService) { }

  ngOnInit() {
    this.form = this.formControl();
    this.type = this.navParams.get('type');
    this.value = this.navParams.get('value');
    this.setUpAmount(this.type);
    if (this.authenticationService.checkLoginStatus()) {
      this.currentUser = this.authenticationService.currentUserValue;
      this.form.get('email').setValue(this.currentUser.email);
    }
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private formControl() {
    return this.formBuilder.group({
      amount: ['', Validators.required],
      email: ['', Validators.compose([
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      content: [''],
      paymentMethod: [this.defaultMethod, Validators.required],
      isAnonymous: [false]
    });
  }

  private setUpAmount(type) {
    if (type !== 'Others') {
      this.form.get('amount').setValue(this.value);
    }
  }

  presentPaymentMethod() {
    const modal = this.modalCtrl.create('PaymentMethodPage', {
      type: 'Treat'
    });
    modal.present();
    modal.onDidDismiss(data => {
      this.paymentMethod = data.paymentMethod || this.paymentMethod;
      this.form.get('paymentMethod').setValue(this.paymentMethod);
    });
  }

  payCoffee() {
    this.needSpinner = true;
    const vl = this.form.value;
    this.userService.getTreatId().pipe(untilDestroyed(this)).subscribe(val => {
      const paymentDetails = this.preparePaymentObject(vl.amount, val.treatId);
      const treatDetails = this.prepareTreatObject(val.treatId);
      // Online payment start
      const object = {
        paymentDetails: paymentDetails,
        treatDetails: treatDetails,
        type: 'treat'
      };
      this.navCtrl.push('PaymentUiPage', object);
      this.needSpinner = false;
    });
  }

  private preparePaymentObject(amount, orderId) {
    const vl = this.form.value;
    let username = '';
    let contact = '';
    if (this.authenticationService.checkLoginStatus()) {
      username = this.currentUser.username;
      contact = this.currentUser.contact;
    }
    const needDevMode = environment.isProd ? false : true;
    const key = environment.isProd ? keys.molpay : keys.molpayDev;
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
      mp_bill_description: `${this.type} (RM${amount} Support)`,
      mp_bill_name: username,
      mp_bill_email: vl.email,
      mp_bill_mobile: contact,
      mp_channel_editing: false,
      mp_bill_name_edit_disabled: false,
      mp_bill_mobile_edit_disabled: false,
      mp_bill_email_edit_disabled: false,
      mp_bill_description_edit_disabled: false,
      mp_advanced_email_validation_enabled: true,
      mp_disabled_channels: ['cash', 'credit']
    };
  }

  private prepareTreatObject(ticketId) {
    const vl = this.form.value;
    let senderId;
    if (this.authenticationService.checkLoginStatus()) {
      senderId = this.currentUser._id;
    }
    const object = {
      treatId: ticketId,
      senderDetails: {
        senderId: senderId,
        senderType: 'user'
      },
      details: {
        email: vl.email,
        content: vl.content,
        amount: vl.amount,
        treatType: this.type,
        paymentMethod: vl.paymentMethod,
        isAnonymous: vl.isAnonymous,
      }
    };
    return object;
  }

  back() {
    this.navCtrl.pop();
  }
}
