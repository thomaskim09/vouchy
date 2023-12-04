import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-coffee',
  templateUrl: 'coffee.html',
})
export class CoffeePage {

  coffeeList: any = [
    { amount: 'RM5', value: 5, type: 'Coffee', icon: 'custom-coffee' },
    { amount: 'RM10', value: 10, type: 'Bubble Tea', icon: 'custom-coffee-10' },
    { amount: 'RM20', value: 20, type: 'Burger', icon: 'custom-coffee-20' },
    { amount: 'RM50', value: 50, type: 'Dinner', icon: 'custom-coffee-50' },
    { amount: 'RM100', value: 100, type: 'Seafood', icon: 'custom-coffee-100' },
    { amount: 'Others', value: '-', type: 'Others', icon: 'custom-coffee-other' },
  ];

  // Ads properties
  androidId: string;
  iosId: string;

  constructor(public navCtrl: NavController) { }

  goToCoffeePay(item) {
    this.navCtrl.push('CoffeePayPage', item);
  }

  back() {
    this.navCtrl.pop();
  }

}
