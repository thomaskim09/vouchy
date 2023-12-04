import { AuthenticationService } from '../../../providers/authentication/authentication.service';
import { CommonService } from '../../../providers/common/common.service';
import { Component, Input } from '@angular/core';
import { MenuService } from '../../../providers/menu/menu.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { AlertController, NavController } from 'ionic-angular';
import { DataService } from './../../../providers/data-service/data.service';

@Component({
  selector: 'order-call',
  templateUrl: 'order-call.html'
})
export class OrderCallComponent {

  @Input('menu') menu: any;
  @Input('itemInCart') itemInCart: any;

  userId: string;
  username: string;

  // Controller
  callWaiterClicked: boolean = false;
  needBillClicked: boolean = false;
  intervalCall: any;
  intervalBill: any;
  countDownCall: number;
  countDownBill: number;
  needTranslate: boolean = false;
  introLoading: boolean = false;
  needSpinner: boolean = false;

  constructor(
    public authenticationService: AuthenticationService,
    public commonService: CommonService,
    public menuService: MenuService,
    public alertCtrl: AlertController,
    public dataService: DataService,
    public navCtrl: NavController) { }

  ngOnInit() {
    if (this.authenticationService.checkLoginStatus()) {
      const currentUser = this.authenticationService.currentUserValue;
      this.userId = currentUser._id;
      this.username = currentUser.username;
    }
    this.listenToTranslate();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    clearInterval(this.intervalCall);
    clearInterval(this.intervalBill);
  }

  private listenToTranslate() {
    this.dataService.currentTranslate.pipe(untilDestroyed(this)).subscribe(val => {
      this.needTranslate = val.needTranslate;
    });
  }

  private presentTableNo(type) {
    this.alertCtrl.create({
      title: this.needTranslate ? '请输入桌子号码' : 'Please Insert Table No',
      inputs: [
        {
          name: 'tableNo',
          placeholder: 'e.g. 21',
          value: this.menu.orderSettings.tableNo,
          type: 'number',
          max: 5
        }],
      buttons: [
        {
          text: this.needTranslate ? '返回' : 'Back',
          role: 'cancel',
        },
        {
          text: this.needTranslate ? '确认' : 'Confirm',
          handler: data => {
            if (!data.tableNo) {
              return;
            }
            if (!this.withinTableNoRange(data.tableNo)) {
              this.commonService.presentToast(this.needTranslate ? '请输入正确桌子号码 :)' : 'Please insert the correct table no :)');
              return;
            }
            this.menu.orderSettings['tableNo'] = data.tableNo;
            this.updateMenu();
            if (type === 'callWaiter') {
              this.callWaiter();
            } else {
              this.needBill();
            }
          }
        }]
    }).present();
  }

  private presentPayCounter() {
    this.alertCtrl.create({
      title: this.needTranslate ? '请到柜台结账 :)' : 'Please pay at counter :)',
      subTitle: this.needTranslate ? '亲爱的客人，我们是在柜台结账的。很抱歉如造成不便 :)' : `Dear customer, please settle your bill at our counter. we apologize for any inconvenience`,
      buttons: [
        {
          text: this.needTranslate ? '返回' : 'Back',
          role: 'cancel',
        },
        {
          text: this.needTranslate ? '好的' : 'Okay',
        }]
    }).present();
  }

  private withinTableNoRange(tableNo) {
    if (!this.menu.menuSettings.td.hasTableNoRange) {
      return true;
    }
    const maxTableNo = Number(this.menu.menuSettings.td.tableNoRange);
    tableNo = Number(tableNo);
    if (tableNo < 1 || tableNo > maxTableNo) {
      return false;
    } else {
      return true;
    }
  }

  private updateMenu() {
    this.dataService.changeMenu({
      categoryList: this.menu.categoryList,
      remarkShortCuts: this.menu.remarkShortCuts,
      menuSettings: this.menu.menuSettings,
      orderSettings: this.menu.orderSettings
    });
  }

  callWaiter() {
    if (!this.menu.orderSettings.tableNo) {
      this.presentTableNo('callWaiter');
      return;
    }
    if (!this.callWaiterClicked) {
      this.alertCtrl.create({
        title: this.needTranslate ? '需要什么吗?' : `Need anything?`,
        subTitle: this.needTranslate ? '如果需要什么能在这里和我们说，我们会事先为您准备' : 'We could prepare beforehand if you need anything.',
        inputs: [
          {
            type: 'radio',
            label: this.needTranslate ? '请给我一个空碗' : 'I need a bowl',
            value: 'I need a bowl'
          },
          {
            type: 'radio',
            label: this.needTranslate ? '请给我一些辣椒' : 'I need some chili',
            value: 'I need some chili'
          },
          {
            type: 'radio',
            label: this.needTranslate ? '请给我一个叉' : 'I need a fork',
            value: 'I need a fork'
          },
          {
            type: 'radio',
            label: this.needTranslate ? '其他' : 'Others',
            value: 'others'
          }],
        buttons: [
          {
            text: this.needTranslate ? '返回' : 'Back',
            role: 'cancel'
          },
          {
            text: this.needTranslate ? '直接呼叫' : 'Call Anyway',
            handler: data => {
              if (data === 'others') {
                this.alertWithOthers();
                return;
              }
              this.callWithReason(data);
            }
          }]
      }).present();
    }
  }

  private alertWithOthers() {
    this.alertCtrl.create({
      title: this.needTranslate ? '需要什么吗?' : `Need anything?`,
      subTitle: this.needTranslate ? '如果需要什么能在这里和我们说，我们会事先为您准备' : 'We could prepare beforehand if you need anything.',
      inputs: [
        {
          name: 'reason',
          placeholder: this.needTranslate ? '如有其他需求' : 'If any',
          type: 'text'
        }],
      buttons: [
        {
          text: this.needTranslate ? '返回' : 'Back',
          role: 'cancel'
        },
        {
          text: this.needTranslate ? '直接呼叫' : 'Call Anyway',
          handler: data => {
            this.callWithReason(data.reason);
          }
        }]
    }).present();
  }

  private callWithReason(reason?) {
    const content = {
      senderId: this.userId,
      receiverId: this.menu.orderSettings.restaurantId,
      title: this.username ? `${this.username} (Table ${this.menu.orderSettings.tableNo})` : `Table ${this.menu.orderSettings.tableNo}`,
      body: `Need waiter's service`,
      username: this.username,
      reason: reason
    };
    this.needSpinner = true;
    this.menuService.needService(content).pipe(untilDestroyed(this)).subscribe(val => {
      this.needSpinner = false;
      this.callWaiterClicked = true;
      this.countDownCall = 30;
      this.intervalBill = setInterval(() => {
        this.countDownCall -= 1;
        if (this.countDownCall === 0) {
          this.callWaiterClicked = false;
          clearInterval(this.intervalBill);
        }
      }, 1000);
      this.commonService.presentToast(this.needTranslate ? '呼叫服务员中' : 'Calling for service');
    });
  }

  needBill() {
    if (this.menu.hasPayCounter) {
      this.presentPayCounter();
      return;
    }
    if (!this.menu.orderSettings.tableNo) {
      this.presentTableNo('needBill');
      return;
    }
    if (!this.needBillClicked) {
      const content = {
        senderId: this.userId,
        receiverId: this.menu.orderSettings.restaurantId,
        title: this.username ? `${this.username} (Table ${this.menu.orderSettings.tableNo})` : `Table ${this.menu.orderSettings.tableNo}`,
        body: 'Need to pay bill',
        username: this.username,
      };
      this.needSpinner = true;
      this.menuService.needService(content).pipe(untilDestroyed(this)).subscribe(val => {
        this.needSpinner = false;
        this.needBillClicked = true;
        this.countDownBill = 30;
        this.intervalCall = setInterval(() => {
          this.countDownBill -= 1;
          if (this.countDownBill === 0) {
            this.needBillClicked = false;
            clearInterval(this.intervalCall);
          }
        }, 1000);
        this.commonService.presentToast(this.needTranslate ? '发出结账要求' : 'Calling for bill');
      });
    }
  }

  goToIntro() {
    this.introLoading = true;
    this.navCtrl.parent.parent.push('IntroPage', {
      needTranslate: this.needTranslate,
      type: 'order'
    });
    this.introLoading = false;
  }
}
