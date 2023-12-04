import { Component } from '@angular/core';
import { DataService } from '../../../providers/data-service/data.service';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'order-detail-remark',
  templateUrl: 'order-detail-remark.html'
})
export class OrderDetailRemarkComponent {

  type: any;
  uniqueCode: any;
  foodId: any;
  mainList: any;
  remarkShortCuts: any;
  remarkList: any = [];
  foodBasePrice: number;
  foodNewPrice: number;
  quantity: number;
  needTakeAway: boolean;

  extraRemarkModel: string;
  wholeItem: any;
  orderCart: any;
  remarkContent: any = [];

  // Controller
  needTranslate: boolean = false;

  constructor(
    public ViewCtrl: ViewController,
    public dataService: DataService,
    public navParams: NavParams) { }

  ngOnInit() {
    this.type = this.navParams.get('type');
    this.uniqueCode = this.navParams.get('uniqueCode');
    this.foodId = this.navParams.get('foodId');
    this.mainList = this.navParams.get('details');
    this.remarkShortCuts = this.navParams.get('remarkShortCuts');
    this.foodBasePrice = this.navParams.get('price');
    this.foodNewPrice = this.navParams.get('price');
    this.orderCart = this.navParams.get('orderCart');
    this.wholeItem = this.navParams.get('wholeItem');
    this.quantity = this.navParams.get('quantity');
    this.needTakeAway = this.navParams.get('needTakeAway');
    this.needTranslate = this.navParams.get('needTranslate');
    this.setUpRemarkAuto(this.mainList, this.remarkShortCuts);
    this.setUpRemarkManual(this.mainList);
    this.setUpDefaultPrice();
    this.setUpDefaultRemarkContent(this.remarkList, this.remarkContent);
  }

  private setUpRemarkAuto(mainList, shortCuts) {
    if (mainList.remarkAuto) {
      this.remarkList = mainList.remarkAuto.map(val => shortCuts.filter(val2 => val2._id === val)[0]);
    }
  }

  private setUpRemarkManual(mainList) {
    if (mainList.remarkManual) {
      mainList.remarkManual.map(val => {
        this.remarkList.push(val);
      });
    }
  }

  private setUpDefaultPrice() {
    this.remarkList.map(val => this.foodNewPrice += val.remarkDetails[0].remarkPrice);
  }

  private setUpDefaultRemarkContent(remarkList, remarkContent) {
    let counter = 0;
    remarkList.map(val => {
      remarkContent.push({
        parentIndex: counter,
        childrenIndex: [0],
      });
      counter++;
    });
  }

  singleModelChanged(details, parentIndex, childIndex) {
    const childrenIndex = Number(childIndex);
    // Minus previous
    const previous = details[this.remarkContent[parentIndex].childrenIndex[0]].remarkPrice;
    this.foodNewPrice -= previous;
    // Update list
    this.remarkContent[parentIndex].childrenIndex = [childrenIndex];
    // Add current
    const current = details[this.remarkContent[parentIndex].childrenIndex[0]].remarkPrice;
    this.foodNewPrice += current;
  }

  multipleModelChanged(details, parentIndex, childrenIndex) {
    const selectedList = [];
    const arrayIndex = [];
    childrenIndex.map(val => {
      selectedList.push(details[Number(val)]);
      arrayIndex.push(Number(val));
    });
    // Minus previous
    let previousTotal = 0;
    this.remarkContent[parentIndex].childrenIndex.map(val => previousTotal += details[val].remarkPrice);
    this.foodNewPrice -= previousTotal;
    // Update list
    this.remarkContent[parentIndex].childrenIndex = arrayIndex;
    // Add current
    let currentTotal = 0;
    this.remarkContent[parentIndex].childrenIndex.map(val => currentTotal += details[val].remarkPrice);
    this.foodNewPrice += currentTotal;
  }

  getRemarkPrice(price) {
    return price === 0 ? '' : ` (+RM ${price})`;
  }

  addToCart() {
    this.wholeItem['code'] = this.uniqueCode;
    this.wholeItem['quantity'] = this.quantity || 1;
    this.wholeItem['foodRemark'] = this.setUpFoodRemark(this.remarkContent, false);
    this.wholeItem['foodRemarkTranslated'] = this.setUpFoodRemark(this.remarkContent, true);
    this.wholeItem['remarkObject'] = this.setUpFoodObject(this.remarkContent);
    this.wholeItem['extraRemark'] = this.extraRemarkModel;
    this.wholeItem['needTakeAway'] = this.needTakeAway;
    this.wholeItem['unitPrice'] = this.foodNewPrice;
    if (this.type === 'Order') {
      this.orderCart.foodItemList.push(this.wholeItem);
    } else if (this.type === 'Confirm') {
      const index = this.orderCart.foodItemList.findIndex(x => x.code === this.uniqueCode);
      this.orderCart.foodItemList[index] = this.wholeItem;
    }
    this.dataService.changeOrderCart({
      foodItemList: this.orderCart.foodItemList,
    });
    this.close(true);
  }

  private setUpFoodRemark(content, translate) {
    let result = '';
    if (this.needTakeAway) {
      result += translate ? '打包, ' : 'Take Away, ';
    }
    content.map(val => {
      if (val.childrenIndex.length) {
        val.childrenIndex.map(val2 => {
          const de = this.remarkList[val.parentIndex].remarkDetails[val2];
          result += translate ? de.remarkNameTranslated : de.remarkName;
          result += ', ';
        });
      }
    });
    if (this.extraRemarkModel) {
      result += this.extraRemarkModel;
    } else {
      result = result.slice(0, -2);
    }
    return result;
  }

  private setUpFoodObject(content) {
    let children;
    const result = content.map(val => {
      if (val.childrenIndex.length) {
        children = val.childrenIndex.map(val2 => ({
          name: this.remarkList[val.parentIndex].remarkDetails[val2].remarkName,
          shortName: this.remarkList[val.parentIndex].remarkDetails[val2].remarkShortName,
          price: this.remarkList[val.parentIndex].remarkDetails[val2].remarkPrice,
        }));
      }
      return {
        parent: val.parentIndex,
        children: children
      };
    });
    return result;
  }

  roundUpPrice(value) {
    return Math.round((value + 0.00001) * 100) / 100;
  }

  getPlaceholder() {
    return this.needTranslate ? '如有其他需求' : 'if any';
  }

  close(isAdded) {
    this.ViewCtrl.dismiss({ isAdded: isAdded });
  }
}
