import { AuthenticationService } from '../../providers/authentication/authentication.service';
import { Component } from '@angular/core';
import { DataService } from '../../providers/data-service/data.service';
import { IonicPage, NavParams } from 'ionic-angular';
import { RestaurantService } from '../../providers/restaurant/restaurant.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import lo_isEmpty from 'lodash/isEmpty';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-voucher-detail',
  templateUrl: 'voucher-detail.html',
})
export class VoucherDetailPage {

  // Big content
  voucherId: any;
  restaurantDetails: any;
  voucherType: string;

  // Object to pass to each components
  voucherMain: any;
  voucherLimitedContent: any;
  voucherContent: any;
  voucherQuantity: any;
  voucherCash: any;
  voucherMonthly: any;
  voucherRules: any;
  voucherInfo: any;
  voucherGroup: any;
  feedback: any;
  voucherButton: any;
  voucherButtonRestaurant: any;

  // Share properties
  voucherName: string;
  voucherImage: string;

  // Controller
  firstEnter: boolean = true;

  constructor(
    public authenticationService: AuthenticationService,
    public dataService: DataService,
    public navParams: NavParams,
    public restaurantService: RestaurantService) { }

  ngOnInit() {
    this.voucherId = this.navParams.get('voucher');
    this.restaurantDetails = this.navParams.get('restaurant');
    this.ListenToRefresh();
  }

  ionViewDidEnter() {
    if (this.firstEnter) {
      this.firstEnter = false;
      this.setUpVoucherDetails(this.voucherId);
    }
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  ionViewWillEnter() {
    if (this.voucherName && this.voucherImage) {
      this.dataService.changeVoucherShare({
        voucherName: this.voucherName,
        voucherImage: this.voucherImage,
      });
    }
  }

  private setUpVoucherDetails(voucherId, refresh?) {
    let userId;
    if (this.authenticationService.checkLoginStatus()) {
      userId = this.authenticationService.currentUserValue._id;
    }
    this.restaurantService.getVoucherDetails(voucherId, userId, refresh).pipe(untilDestroyed(this)).subscribe(val => {
      this.assignToEachComponent(val);
    });
  }

  private ListenToRefresh() {
    this.dataService.currentRefreshContent.pipe(untilDestroyed(this)).subscribe(val => {
      if (!lo_isEmpty(val)) {
        if (val.voucherDetailsPage && this.voucherId === val.voucherId) {
          this.setUpVoucherDetails(val.voucherId, true);
        }
      }
    });
  }

  private assignToEachComponent(val) {
    const de = val.details;
    this.voucherType = de.voucherType;

    // Assign to voucher share
    this.voucherName = de.voucherName;
    if (de.voucherImage) {
      this.voucherImage = de.voucherImage;
    }
    // Handle user purchase history
    if (de.userPurchaseHistory && de.userPurchaseHistory.length === 0) {
      de.userPurchaseHistory = undefined;
    }
    // Main
    this.voucherMain = {
      voucherName: de.voucherName,
      quantitySold: de.quantitySold,
      voucherImage: this.voucherImage || de.voucherImage
    };
    // Limited control
    if (de.limitedQuantity || de.limitedEndTime || de.startSellingTime) {
      this.voucherLimitedContent = {
        voucherId: this.voucherId,
        status: val.status,
        soldOutTime: de.soldOutTime,
        quantitySold: de.quantitySold,
        limitedQuantity: de.limitedQuantity,
        limitedEndTime: de.limitedEndTime,
        startSellingTime: de.startSellingTime,
      };
    }
    switch (de.voucherType) {
      case 'SV':
        this.voucherContent = {
          setDetails: de.setDetails,
        };
        break;
      case 'CV':
        this.voucherCash = {
          basePrice: de.basePrice,
          minimumSpend: de.minimumSpend,
        };
        break;
      case 'QV':
        this.voucherQuantity = {
          quantityUnit: de.quantityUnit,
          quantityDetails: de.quantityDetails,
        };
        break;
      case 'MV':
        this.voucherMonthly = {
          limitPerDay: de.limitPerDay,
          monthlyDetails: de.monthlyDetails
        };
        break;
    }
    // Rules
    this.voucherRules = de.voucherRules;
    // Group
    if (de.groupVoucherDetails) {
      this.voucherGroup = {
        groupVoucherDetails: de.groupVoucherDetails,
      };
    }
    // Info
    this.voucherInfo = {
      quantitySold: de.quantitySold,
      limitedQuantity: de.limitedQuantity,
      limitedQuantityPerUser: de.limitedQuantityPerUser,
      userPurchaseHistory: de.userPurchaseHistory
    };
    // Feedback
    this.feedback = {
      type: 'voucher',
      id: this.voucherId,
      pageSize: 2,
      pageNum: 1,
    };
    // Button
    this.voucherButton = {
      voucherId: this.voucherId,
      status: val.status,
      newPrice: de.newPrice,
      basePrice: de.basePrice,
      restaurantId: this.restaurantDetails._id,
      restaurantName: this.restaurantDetails.details.restaurantName,
      voucherImage: this.voucherImage || de.voucherImage,
      // To remind customer before 3 days
      validUntil: de.voucherRules.validUntil,
      // To check if monthly during alert
      voucherType: de.voucherType,
      // To check limited end time
      limitedEndTime: de.limitedEndTime,
      // To check start selling time
      startSellingTime: de.startSellingTime,
      // to check limited quantity per user
      quantitySold: de.quantitySold,
      limitedQuantity: de.limitedQuantity,
      limitedQuantityPerUser: de.limitedQuantityPerUser,
      userPurchaseHistory: de.userPurchaseHistory
    };
  }

}
