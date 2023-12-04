import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CommonService } from '../../../providers/common/common.service';
import {
  isAfter, isBefore, parseISO,
  differenceInDays, addDays, differenceInHours, addHours,
  differenceInMinutes, addMinutes, differenceInSeconds
} from 'date-fns';

@Component({
  selector: 'voucher-detail-button',
  templateUrl: 'voucher-detail-button.html'
})
export class VoucherDetailButtonComponent {

  @Input('voucherButton') input: any;

  grabTimeTitle: any;
  grabMode: boolean;
  intervalId: any;

  // Controller
  needButton: boolean = true;
  needSpinner: boolean = false;

  @Output() limitStatus = new EventEmitter();

  constructor(
    public navCtrl: NavController,
    public commonService: CommonService) { }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  ngOnChanges() {
    if (this.input) {
      this.needButton = this.checkAllLimited(this.input);
      this.calculateTimeLeft(this.input.startSellingTime);
    }
  }

  // from voucher-detail-limited & voucher-detail-info @Output()
  receivedData(data: any) {
    this.needButton = this.checkStatus(data);
  }

  // emit to voucher-detail-limited @Input()
  emitData(data) {
    this.limitStatus.emit(data);
  }

  private checkStatus(status) {
    switch (status) {
      case 'SO': return false;
      case 'LO': return false; // Limited time over
      case 'XP': return false; // Expired
      default: return true;
    }
  }

  private checkAllLimited(input) {
    const LET = input.limitedEndTime;
    const LQ = input.limitedQuantity;
    const LQPU = input.limitedQuantityPerUser;
    if (LET && LQ && LQPU) {
      return (this.checkLimitedEndTime(input) && this.checkLimitedQuantity(input) && this.checkLimitPerUser(input));
    } else if (LET && LQ) {
      return (this.checkLimitedEndTime(input) && this.checkLimitedQuantity(input));
    } else if (LQ && LQPU) {
      return (this.checkLimitedQuantity(input) && this.checkLimitPerUser(input));
    } else if (LET && LQPU) {
      return (this.checkLimitedEndTime(input) && this.checkLimitPerUser(input));
    } else if (LET) {
      return this.checkLimitedEndTime(input);
    } else if (LQ) {
      return this.checkLimitedQuantity(input);
    } else if (LQPU) {
      return this.checkLimitPerUser(input);
    } else { return this.checkStatus(input.status); }
  }

  private checkLimitedQuantity(input) {
    return (input.quantitySold >= input.limitedQuantity) ? false : true;
  }

  private checkLimitedEndTime(input) {
    return isAfter(new Date(), parseISO(input.limitedEndTime)) ? false : true;
  }

  private checkLimitPerUser(input) {
    if (input.userPurchaseHistory) {
      if (input.userPurchaseHistory.length) {
        const stillCanPurchase = input.limitedQuantityPerUser - input.userPurchaseHistory[0].quantityPurchased;
        if (stillCanPurchase <= 0) {
          return false;
        } else if (input.limitedQuantity) {
          const quantityLeft = input.limitedQuantity - input.quantitySold;
          if (stillCanPurchase > quantityLeft && quantityLeft <= 0) {
            return false;
          } else { return true; }
        } else { return true; }
      } else { return true; }
    } else { return true; }
  }

  private calculateTimeLeft(startSellingTime) {
    if (!startSellingTime) {
      return;
    }
    startSellingTime = parseISO(startSellingTime);

    // Set the time when the page loaded
    this.grabTimeTitle = this.setTimeSlot(startSellingTime);

    // If still can count down start selling time
    if (isBefore(new Date(), startSellingTime)) {
      this.grabMode = true;
      this.emitData('WG');
      this.intervalId = setInterval(() => {
        const timeSlot = this.setTimeSlot(startSellingTime);
        this.grabTimeTitle = timeSlot;
        if (timeSlot === '00:00:00:00' || timeSlot.slice(-3)[0] === '-') {
          clearInterval(this.intervalId);
          this.grabMode = false;
          this.emitData('OP');
          return;
        }
      }, 1000);
    } else {
      this.grabMode = false;
      this.emitData('OP');
      return;
    }
  }

  private setTimeSlot(time) {
    let x = new Date();
    const y = time;
    let temp;
    let result;
    temp = differenceInDays(y, x).toString();
    result = (temp.length === 1 ? '0' + temp : temp) + ':';
    x = addDays(x, temp);
    temp = differenceInHours(y, x).toString();
    result += (temp.length === 1 ? '0' + temp : temp) + ':';
    x = addHours(x, temp);
    temp = differenceInMinutes(y, x).toString();
    result += (temp.length === 1 ? '0' + temp : temp) + ':';
    x = addMinutes(x, temp);
    temp = differenceInSeconds(y, x).toString();
    result += (temp.length === 1 ? '0' + temp : temp);
    return result;
  }

  goToConfirmVoucher() {
    if (!this.grabMode) {
      this.needSpinner = true;
      const object = {
        voucherId: this.input.voucherId,
        restaurantId: this.input.restaurantId,
        restaurantName: this.input.restaurantName,
        voucherImage: this.input.voucherImage,
        validUntil: this.input.validUntil,
        voucherType: this.input.voucherType
      };
      this.navCtrl.parent.parent.push('ConfirmVoucherPage', object);
      this.needSpinner = false;
    } else {
      this.commonService.presentToast('Grab time haven\'t start yet :)');
    }
  }

}
