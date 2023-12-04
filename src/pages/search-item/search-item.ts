import * as Fuse from 'fuse.js';
import lo_isEmpty from 'lodash/isEmpty';
import { Component, ViewChild } from '@angular/core';
import { DataService } from '../../providers/data-service/data.service';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { MenuService } from '../../providers/menu/menu.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Platform } from 'ionic-angular/platform/platform';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-search-item',
  templateUrl: 'search-item.html',
  providers: [Keyboard]
})
export class SearchItemPage {

  defaultList: any;
  searchClicked: boolean = false;
  notAvailableItem: any;

  // components params
  wholeFoodList: any;
  menuId: string;
  menu: any = {
    menuSettings: undefined,
    orderSettings: undefined,
    foodList: [],
    categoryList: [],
    remarkShortCuts: undefined
  };
  orderCart: any = {
    foodItemList: [],
    remarkContent: [],
    totalPrice: 0
  };

  // HTML properties
  searchModel: any;
  needTranslate: boolean = false;

  // Basic properties
  filteredList: any = [];
  searchList: any = [];

  // To show native keyboard
  @ViewChild('input') searchInput;

  // Fuse properties
  options = {
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 16,
    minMatchCharLength: 1,
    keys: [
      'itemName',
      'itemNameTranslated'
    ]
  };

  // Controller
  timer: any;

  constructor(
    public dataService: DataService,
    public keyboard: Keyboard,
    public menuService: MenuService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform) { }

  ngOnInit() {
    this.menu = this.navParams.get('menu');
    this.menuId = this.navParams.get('menuId');
    this.needTranslate = this.navParams.get('needTranslate');
    this.listenFoodList();
    this.listenMenuList();
    this.listenToCartChanges();
    this.setUpFoodList(this.menuId);
    this.showKeyboard();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    clearTimeout(this.timer);
  }

  private listenFoodList() {
    this.dataService.currentFoodList.pipe(untilDestroyed(this)).subscribe(val => {
      if (!lo_isEmpty(val)) {
        if (val.foodList) {
          this.wholeFoodList = val.foodList;
        }
      }
    });
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
        this.orderCart['remarkContent'] = val.remarkContent;
        this.orderCart['totalPrice'] = this.calculateTotalPrice(val.foodItemList);
      }
    });
  }

  private calculateTotalPrice(list) {
    const total = list.reduce((a, c) => a + (c.unitPrice * c.quantity), 0);
    return this.roundUpPrice(total);
  }

  private roundUpPrice(value) {
    return Math.round((value + 0.00001) * 100) / 100;
  }

  private setUpFoodList(menuId) {
    this.menuService.getFoodSearchList(menuId).pipe(untilDestroyed(this)).subscribe(val => {
      this.defaultList = val.slice(0, 7);
      this.searchList = val;
    });
  }

  filterQuery(val) {
    this.searchClicked = false;
    const fuse = new Fuse(this.searchList, this.options);
    const results = fuse.search(val);

    const limitedResult = [];
    for (let i = 0; i < results.length; ++i) {
      limitedResult.push(results[i]);
      if (i > 6) { break; }
    }
    this.filteredList = limitedResult;
  }

  searchItem(item) {
    this.searchClicked = true;

    const foodList = this.wholeFoodList.filter(val => val._id === item._id);
    if (foodList && foodList.length) {
      this.menu['foodList'] = foodList;
    } else {
      this.menuService.getFoodDetails(this.menuId, item._id).pipe(untilDestroyed(this)).subscribe(val => {
        if (val.length) {
          this.menu['foodList'] = val;
        } else {
          this.notAvailableItem = item;
        }
      });
    }
  }

  private showKeyboard() {
    if (!this.platform.is('cordova')) {
      return;
    }
    this.timer = setTimeout(() => {
      this.searchInput.setFocus();
      this.keyboard.show();
    }, 500);
  }

  getPlaceholder() {
    return this.needTranslate ? '食物名称' : `Food's name`;
  }

  back() {
    this.navCtrl.pop();
  }
}
