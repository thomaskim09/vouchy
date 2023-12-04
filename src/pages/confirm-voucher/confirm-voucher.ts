import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { RestaurantService } from '../../providers/restaurant/restaurant.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { formatDistanceStrict, subDays, parseISO, isWithinInterval } from 'date-fns';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-confirm-voucher',
  templateUrl: 'confirm-voucher.html',
})
export class ConfirmVoucherPage {

  // Params passed in
  voucherId: string;
  restaurantId: string;
  restaurantName: string;
  voucherImage: string;
  voucherDetails: any;
  restaurantDetails: any;

  // Components input
  confirmVoucherMain: any;
  confirmVoucherInfo: any;
  confirmVoucherGroup: any;
  confirmVoucherControl: any;
  confirmVoucherPayment: any;
  confirmVoucherButton: any;

  // HTML controller
  voucherType: string;

  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public restaurantService: RestaurantService) { }

  ngOnInit() {
    this.voucherId = this.navParams.get('voucherId');
    this.restaurantId = this.navParams.get('restaurantId');
    this.restaurantName = this.navParams.get('restaurantName');
    this.voucherImage = this.navParams.get('voucherImage');
    this.checkValidUntil(this.navParams.get('validUntil'), this.navParams.get('voucherType'));
    this.setUpVoucherDetails();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private checkValidUntil(validUntil, voucherType) {
    const date = parseISO(validUntil);
    const threeDayBefore = subDays(date, 3);
    if (isWithinInterval(new Date(), { start: threeDayBefore, end: date })) {
      if (voucherType === 'MV') {
        return;
      }
      this.alertCtrl.create({
        title: 'Reminder',
        subTitle: `Please noted that this voucher offer will end in <b>${formatDistanceStrict(date, new Date())}</b> :)`,
      }).present();
    }
  }

  private setUpVoucherDetails() {
    this.restaurantService.getVoucherDetails(this.voucherId).pipe(untilDestroyed(this)).subscribe(val => {

      const de = val.details;
      this.voucherType = de.voucherType;

      if (de.userPurchaseHistory && de.userPurchaseHistory.length === 0) {
        de.userPurchaseHistory = undefined;
      }
      // Assign array to pass data
      this.confirmVoucherMain = {
        voucherId: val._id,
        voucherName: de.voucherName,
        voucherImage: this.voucherImage || de.voucherImage,
        newPrice: de.newPrice,
        basePrice: de.basePrice,
        quantitySold: de.quantitySold,
        groupVoucherDetails: de.groupVoucherDetails,
      };
      this.confirmVoucherInfo = {
        quantitySold: de.quantitySold,
        limitedQuantity: de.limitedQuantity,
        limitedQuantityPerUser: de.limitedQuantityPerUser,
        userPurchaseHistory: de.userPurchaseHistory
      };
      this.confirmVoucherGroup = {
        groupVoucherDetails: de.groupVoucherDetails,
      };
      this.confirmVoucherControl = {
        newPrice: de.newPrice,
        basePrice: de.basePrice,
        quantitySold: de.quantitySold,
        groupVoucherDetails: de.groupVoucherDetails,
        limitedQuantity: de.limitedQuantity,
        limitedQuantityPerUser: de.limitedQuantityPerUser,
        userPurchaseHistory: de.userPurchaseHistory
      };
      this.confirmVoucherPayment = {
        newPrice: de.newPrice,
      };
      this.confirmVoucherButton = {
        restaurantId: this.restaurantId,
        restaurantList: val.restaurantList,
        restaurantName: this.restaurantName,
        voucherId: val._id,
        newPrice: de.newPrice,
        limitedQuantity: de.limitedQuantity,
        limitedQuantityPerUser: de.limitedQuantityPerUser,
        userPurchaseHistory: de.userPurchaseHistory,
        voucherDetails: {
          voucherImage: de.voucherImage,
          voucherName: de.voucherName,
          newPrice: de.newPrice,
          basePrice: de.basePrice,
          validUntil: de.voucherRules.validUntil,
          quantityUnit: de.quantityUnit,
          limitPerDay: de.limitPerDay,
          minimumSpend: de.minimumSpend
        },
        // Check voucher
        quantitySold: de.quantitySold,
        soldOutTime: de.soldOutTime,
        limitedEndTime: de.limitedEndTime,
        startSellingTime: de.startSellingTime,
        validUntil: de.voucherRules.validUntil
      };
    });
  }

  back() {
    this.navCtrl.pop();
  }

}
