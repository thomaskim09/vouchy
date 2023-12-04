import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, AlertController } from 'ionic-angular';
import { MenuService } from '../../../providers/menu/menu.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { DataService } from './../../../providers/data-service/data.service';
import lo_isEmpty from 'lodash/isEmpty';
import { Vibration } from '@ionic-native/vibration';
import { CommonService } from './../../../providers/common/common.service';
import { SoundService } from '../../../providers/data-service/sound.service';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-confirm-order-pop-over',
  templateUrl: 'confirm-order-pop-over.html',
})
export class ConfirmOrderPopOverPage {

  // HTML properties
  menu: any;
  orderId: string;
  status: string;
  finalOrder: any;
  content: any;
  confirmText: string;
  deniedText: string;

  // Cleaner code
  input: any;

  // Controller
  needSpinner: boolean = false;
  needLoader: boolean = false;
  statusConfirmed: boolean = false;
  needTranslate: boolean = false;
  slideCounter: number = 0;
  intervalId: any;

  constructor(
    public alertCtrl: AlertController,
    public menuService: MenuService,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public dataService: DataService,
    public vibration: Vibration,
    public commonService: CommonService,
    public soundService: SoundService) { }

  ngOnInit() {
    this.menu = this.navParams.get('menu');
    this.orderId = this.navParams.get('orderId');
    this.status = this.navParams.get('status');
    this.finalOrder = this.navParams.get('finalOrder');
    this.content = this.navParams.get('content');
    this.needTranslate = this.navParams.get('needTranslate');
    this.setUpDifferently(this.status, this.orderId, this.content);
    this.startSlide();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    clearInterval(this.intervalId);
  }

  private setUpDifferently(status, orderId?, content?) {
    if (status === 'AC' || status === 'CF' || status === 'CC') {
      this.statusConfirmed = true;
    }
    switch (status) {
      case 'PC': this.listenNotification(); break;
      case 'PA': this.checkOrderResponse(orderId); break;
      case 'AC':
      case 'CF': this.confirmText = this.needTranslate ? '您的食物已开始准备！' : 'Your food will be ready soon! :)'; break;
      case 'CD': this.confirmText = this.needTranslate ? '确认付账，祝您有个美好的一天' : 'Payment recieved, enjoy your day'; break;
      case 'CC': this.deniedText = content ? `${this.needTranslate ? '理由: ' : 'Reason: '} ${content.reason}` : undefined; break;
      case 'CT': this.deniedText = this.needTranslate ? '抱歉如造成不便' : 'We apologize for any inconvenience'; break;
    }
  }

  private startSlide() {
    this.intervalId = setInterval(() => {
      this.slideCounter++;
      if (this.slideCounter === 4) {
        this.slideCounter = 0;
      }
    }, 3000);
  }

  approveResponse() {
    event.stopPropagation();
    this.changeOrderStatus('AC');
  }

  rejectResponse() {
    event.stopPropagation();
    this.changeOrderStatus('RJ');
  }

  close(status) {
    switch (status) {
      case 'PC':
      case 'PA': this.viewDismiss(false, status, true); break;
      case 'AC':
      case 'RJ':
      case 'CF':
      case 'CC':
      case 'CT': this.viewDismiss(true, status, false); break;
      default: this.viewDismiss(true, status, false); break;
    }
  }

  private changeOrderStatus(status, finalOrder?) {
    this.needSpinner = true;
    if (finalOrder) {
      finalOrder['menuSettings'] = this.menu.menuSettings;
    }
    const object = {
      orderId: this.orderId,
      status: status,
      content: finalOrder,
      restaurantId: this.menu.orderSettings.restaurantId
    };
    this.menuService.checkOrderStatus(object.orderId, object.status).pipe(untilDestroyed(this)).subscribe(val => {
      this.menuService.changeOrderStatus(object).pipe(untilDestroyed(this)).subscribe(val2 => {
        this.needSpinner = false;
        this.status = status;
        if (this.status !== 'AC') {
          this.close(status);
        } else {
          this.setUpDifferently(status);
        }
      });
    }, error => {
      this.needSpinner = false;
      this.alertCtrl.create({
        title: this.needTranslate ? '订单状态已更新' : 'Order status has been updated',
        subTitle: error.error.message,
        buttons: [
          {
            text: this.needTranslate ? '知道了' : 'Got It',
            handler: () => {
              this.status = status;
              this.close(status);
            }
          }]
      }).present();
    });
  }

  private listenNotification() {
    this.dataService.currentFcmMessage.pipe(untilDestroyed(this)).subscribe(val => {
      if (!lo_isEmpty(val)) {
        if (val.msg.content.orderId === this.orderId && !this.statusConfirmed) {
          this.status = val.msg.content.status;
          this.setUpDifferently(this.status, this.orderId, val.msg.content);
          this.soundService.playSound();
          this.vibration.vibrate([100, 100, 100]);
          this.commonService.presentToast(''); // Trigger dom update
        }
      }
    });
  }

  private checkOrderResponse(orderId) {
    if (this.needLoader) {
      this.commonService.presentToast(this.needTranslate ? '获取回复中...' : 'Loading response... Please wait :)');
      return;
    }
    this.needLoader = true;
    this.menuService.getOrderDetails(orderId).pipe(untilDestroyed(this)).subscribe(val => {
      this.status = val.status;
      const res = val.responseDetails;
      this.input = {
        description: res.description,
        subTotal: res.subTotal.toFixed(2),
        amountType: res.amountType,
        amountPrice: res.amountPrice.toFixed(2),
        packagingFee: this.zero(res.packagingFee).toFixed(2),
        taxCharge: this.zero(res.taxCharge).toFixed(2),
        serviceCharge: this.zero(res.serviceCharge).toFixed(2),
        roundingType: res.roundingType,
        roundingAdjustment: res.roundingAdjustment.toFixed(2),
        totalPrice: res.totalPrice.toFixed(2),
      };
      this.finalOrder = val; // Override previous value
      this.needLoader = false;
    });
  }

  private zero(value) {
    return value || 0;
  }

  private viewDismiss(navigateToMenu, status, confirmClicked) {
    this.viewCtrl.dismiss({
      navigateToMenu: navigateToMenu,
      status: status,
      confirmClicked: confirmClicked
    });
  }

  // HTML text getter
  getServiceChargeText() {
    if (this.needTranslate) {
      return `服务税 (${this.menu.menuSettings.td.serviceChargePercentage}%)`;
    } else {
      return `Service Charge (${this.menu.menuSettings.td.taxPercentage}%)`;
    }
  }

  getSSTText() {
    if (this.needTranslate) {
      return `税务 (${this.menu.menuSettings.td.taxPercentage}% SST)`;
    } else {
      return `Tax (${this.menu.menuSettings.td.taxPercentage}% SST)`;
    }
  }
}
