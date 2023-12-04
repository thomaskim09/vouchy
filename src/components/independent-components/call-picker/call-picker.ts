import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-call-picker',
  templateUrl: 'call-picker.html',
  providers: [InAppBrowser]
})
export class CallPickerPage {

  type: string;
  contact: string;

  constructor(
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public iab: InAppBrowser) {
  }

  ngOnInit() {
    this.type = this.navParams.get('type');
    this.contact = this.navParams.get('contact');
  }

  openDialler() {
    this.iab.create(`tel:${this.contact}`, '_system');
  }

  openWhatsapp() {
    this.iab.create(`https://wa.me/6${this.contact}`, '_system');
  }

  openMessenger() {
    this.iab.create('http://m.me/VouchyApp', '_system');
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
