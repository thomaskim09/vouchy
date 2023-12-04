import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

class Options {
  // Default
  nearby?: boolean;
  // Area tab
  cityModel?: string;
  areaModel?: string;
  locationModel?: string;
  locationType?: string;
  // Categories tab
  categoryTitleModel?: string;
  resTypeModel?: string;
  foodTypeModel?: string;
  // General tab
  arrangeModel?: string;
  voucherModel?: string;
  priceRange?: number;
  paxRange?: number;
  // Refresh api call
  refresh?: boolean;
}

class Item {
  type: string;
  field: string;
  id: string;
  result?: any;
}

class ConfirmContent {
  quantity: number;
  newPricePerUnit: number;
  totalPrice: number;
  paymentMethod: string;
  isRewarded: boolean;
}

class Refresh {
  voucherDetailsPage?: boolean;
  voucherId?: string;
  ticketPage?: boolean;
  ticketDetailPage?: boolean;
  refresh: boolean;
  userPage: boolean;
  userId?: string;
}

class Reservation {
  selectedDate: Date;
  form: any;
}

class Infinite {
  needInfiniteScroll: boolean;
  pageNum: number;
}

class Menu {
  menuSettings: any;
  orderSettings: any;
  categoryList: any;
  foodList: any;
  remarkShortCuts: any;
}

class OrderCart {
  foodItemList: any;
  remarkContent: any;
  totalPrice: number;
  canPop: boolean;
}

class FoodList {
  foodList: any;
}

class VoucherShare {
  voucherName: string;
  voucherImage: string;
}

class FcmMessage {
  msg: any;
}

class CommonNoti {
  hasNotification: boolean;
}

class Translate {
  needTranslate: boolean;
}

@Injectable()
export class DataService {

  private userOptionsSource = new BehaviorSubject(new Options());
  currentUserOptions = this.userOptionsSource.asObservable();

  private searchTriggerSource = new BehaviorSubject(new Item());
  currentSearchTrigger = this.searchTriggerSource.asObservable();

  private confirmContentSource = new BehaviorSubject(new ConfirmContent());
  currentConfirmContent = this.confirmContentSource.asObservable();

  private refreshContentSource = new BehaviorSubject(new Refresh());
  currentRefreshContent = this.refreshContentSource.asObservable();

  private reservationSource = new BehaviorSubject(new Reservation());
  currentReservation = this.reservationSource.asObservable();

  private infiniteTriggerSource = new BehaviorSubject(new Infinite());
  currentInfiniteTrigger = this.infiniteTriggerSource.asObservable();

  private menuSource = new BehaviorSubject(new Menu());
  currentMenu = this.menuSource.asObservable();

  private orderCartSource = new BehaviorSubject(new OrderCart());
  currentOrderCart = this.orderCartSource.asObservable();

  private foodListSource = new BehaviorSubject(new FoodList());
  currentFoodList = this.foodListSource.asObservable();

  private voucherShareSource = new BehaviorSubject(new VoucherShare());
  currentVoucherShare = this.voucherShareSource.asObservable();

  private fcmMessageSource = new BehaviorSubject(new FcmMessage());
  currentFcmMessage = this.fcmMessageSource.asObservable();

  private commonNotiSource = new BehaviorSubject(new CommonNoti());
  currentCommonNoti = this.commonNotiSource.asObservable();

  private translateSource = new BehaviorSubject(new Translate());
  currentTranslate = this.translateSource.asObservable();

  constructor() { }

  changeUserOptions(options: any) {
    this.userOptionsSource.next(options);
  }

  changeSearchTrigger(options: any) {
    this.searchTriggerSource.next(options);
  }

  changeConfirmContent(options: any) {
    this.confirmContentSource.next(options);
  }

  changeRefreshContent(options: any) {
    this.refreshContentSource.next(options);
  }

  changeReservation(options: any) {
    this.reservationSource.next(options);
  }

  changeInfiniteTrigger(options: any) {
    this.infiniteTriggerSource.next(options);
  }

  changeMenu(options: any) {
    this.menuSource.next(options);
  }

  changeOrderCart(options: any) {
    this.orderCartSource.next(options);
  }

  changeFoodList(options: any) {
    this.foodListSource.next(options);
  }

  changeVoucherShare(options: any) {
    this.voucherShareSource.next(options);
  }

  changeFcmMessage(options: any) {
    this.fcmMessageSource.next(options);
  }

  changeCommonNoti(options: any) {
    this.commonNotiSource.next(options);
  }

  changeTranslate(options: any) {
    this.translateSource.next(options);
  }
}
