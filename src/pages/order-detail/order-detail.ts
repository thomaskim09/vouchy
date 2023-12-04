import lo_isEmpty from 'lodash/isEmpty';
import { Component } from '@angular/core';
import { DataService } from '../../providers/data-service/data.service';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MenuService } from '../../providers/menu/menu.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html',
})
export class OrderDetailPage {

  // Params received
  menuId: string;
  restaurantId: string;
  categoryId: string;
  categoryIndex: number;

  // Main settings
  menu: any = {
    menuSettings: undefined,
    orderSettings: undefined,
    foodList: [],
    categoryList: [],
    remarkShortCuts: undefined
  };

  // Cart properties
  itemInCart: boolean = false;
  orderCart: any = {
    foodItemList: [],
    totalPrice: 0
  };

  // Infinite scroll
  pageNum: number = 1;
  pageSize: number = 10;

  // Tools controller
  categoryCounter: number = 0;
  needInfiniteScroll: boolean = true;
  timer: any;
  firstEnter: boolean = true;

  constructor(
    public dataService: DataService,
    public menuService: MenuService,
    public navCtrl: NavController,
    public navParams: NavParams) { }

  ngOnInit() {
    this.restaurantId = this.navParams.get('restaurantId');
    this.menuId = this.navParams.get('menuId');
    this.categoryId = this.navParams.get('categoryId');
    this.categoryIndex = this.navParams.get('index');
    this.listenMenuList();
    this.listenToCartChanges();
  }

  ionViewDidEnter() {
    if (this.firstEnter) {
      this.firstEnter = false;
      this.checkSetUpFoodList();
    }
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    clearTimeout(this.timer);
  }

  private checkSetUpFoodList() {
    if (this.categoryIndex === 0) {
      this.timer = setTimeout(() => { this.setUpFoodList(); }, 1000);
    } else {
      this.setUpFoodList();
    }
  }

  private listenMenuList() {
    this.dataService.currentMenu.pipe(untilDestroyed(this)).subscribe(val => {
      if (!lo_isEmpty(val)) {
        this.menu['categoryList'] = val.categoryList;
        this.menu['remarkShortCuts'] = val.remarkShortCuts;
        this.menu['menuSettings'] = val.menuSettings;
        this.menu['orderSettings'] = val.orderSettings;
      }
    });
  }

  private listenToCartChanges() {
    this.dataService.currentOrderCart.pipe(untilDestroyed(this)).subscribe(val => {
      if (!lo_isEmpty(val)) {
        this.orderCart['foodItemList'] = val.foodItemList;
        this.orderCart['totalPrice'] = this.calculateTotalPrice(val.foodItemList);
        this.itemInCart = (this.orderCart.foodItemList.length !== 0) ? true : false;
      }
    });
  }

  private calculateTotalPrice(list) {
    const total = list.reduce((a, c) => a + (c.unitPrice * c.quantity), 0);
    return this.roundUpPrice(total);
  }

  private setUpFoodList(infiniteScroll?) {
    if (!this.categoryId) {
      return;
    }
    this.menuService.getFoodList(this.menuId, this.categoryId, this.pageSize, this.pageNum).pipe(untilDestroyed(this)).subscribe(val => {
      this.menu.foodList = [...this.menu.foodList, ...val];
      this.dataService.changeFoodList({ foodList: this.menu.foodList });

      if (infiniteScroll) {
        infiniteScroll.complete();
      }

      if (val.length < this.pageSize) {
        if (this.categoryIndex === -1) {
          this.pageNum = 1;
          this.needInfiniteScroll = true;
          this.categoryId = this.nextCategory();
          if (this.menu.foodList.length < 5 && this.pageNum === 1) {
            this.setUpFoodList(infiniteScroll);
          }
        } else {
          this.pageNum = 1;
          this.needInfiniteScroll = false;
        }
      } else {
        this.pageNum++;
        this.needInfiniteScroll = true;
      }
    });
  }

  private nextCategory() {
    this.categoryCounter++;
    if (this.menu['categoryList'][this.categoryCounter]) {
      const next = this.menu['categoryList'][this.categoryCounter]._id;
      if (next) {
        return next;
      } else {
        this.needInfiniteScroll = false;
        return undefined;
      }
    } else {
      this.needInfiniteScroll = false;
      return undefined;
    }
  }

  loadMore(infiniteScroll) {
    this.setUpFoodList(infiniteScroll);
  }

  private roundUpPrice(value) {
    return Math.round((value + 0.00001) * 100) / 100;
  }

  checkIfSpace() {
    const DI = this.menu.orderSettings.isDineIn;
    const CS = this.menu.menuSettings.cd.hasCallService;
    const IC = this.itemInCart;
    if (DI && CS && IC) {
      return '8em';
    } else if (DI && CS && !IC) {
      return '4em';
    } else if (DI && !CS && IC) {
      return '4em';
    } else if (IC) {
      return '4em';
    } else if (!IC) {
      return '0em';
    }
  }

  checkIfCall() {
    return this.menu.orderSettings.isDineIn && this.menu.menuSettings.cd.hasCallService ? true : false;
  }
}
