import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { CommonService } from '../../../providers/common/common.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { environment } from '../../../providers/environments/environments';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-order-picker',
  templateUrl: 'order-picker.html',
})
export class OrderPickerPage {

  orderParams: any;

  constructor(
    public barcodeScanner: BarcodeScanner,
    public commonService: CommonService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public platform: Platform) {
  }

  ngOnInit() {
    this.orderParams = this.navParams.get('orderParams');
  }

  openScanner() {
    if (environment.isProd) {
      this.scanQR();
    } else {
      this.openDineIn();
    }
  }

  private scanQR() {
    if (!this.platform.is('cordova')) {
      return;
    }
    const options = {
      prompt: 'Please scan the qr code on the table',
      disableSuccessBeep: true,
      showTorchButton: true,
    };
    this.barcodeScanner.scan(options).then(data => {
      if (!data.text) {
        return;
      }
      const urlParams = new URLSearchParams(data.text);
      const restaurantId = urlParams.get('restaurantId');
      if (restaurantId) {
        this.navCtrl.push('OrderPage', {
          restaurantId: restaurantId,
        });
      } else {
        this.commonService.presentToast('Please scan a valid dine in QR code :)');
      }
      this.close();
    });
  }

  private openDineIn() {
    this.orderParams['needTakeAway'] = false;
    this.orderParams['isDineIn'] = true;
    this.navCtrl.push('OrderPage', this.orderParams);
    this.close();
  }

  openTakeAway() {
    this.orderParams['needTakeAway'] = true;
    this.orderParams['isDineIn'] = false;
    this.navCtrl.push('OrderPage', this.orderParams);
    this.close();
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
