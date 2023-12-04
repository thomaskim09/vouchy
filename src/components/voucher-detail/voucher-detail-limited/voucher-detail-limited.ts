import { Component, Input, Output, EventEmitter } from '@angular/core';
import { formatDistance, formatDistanceStrict, isBefore, parseISO, differenceInDays, addDays, differenceInHours, addHours, differenceInMinutes, addMinutes, differenceInSeconds } from 'date-fns';

@Component({
  selector: 'voucher-detail-limited',
  templateUrl: 'voucher-detail-limited.html'
})
export class VoucherDetailLimitedComponent {

  @Input('voucherLimitedContent') input: any;

  noCard: boolean = false;
  timeLeftTitle: any;
  quantityLeft: number;
  progress: number;
  title: string;
  hasSoldOut: boolean;
  limitTimeOver: boolean;

  intervalId: any;
  timer: any;

  @Output() buttonStatus = new EventEmitter();

  constructor() { }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    clearTimeout(this.timer);
  }

  ngOnChanges() {
    if (this.input) {
      this.calculateQuantityLeft(this.input.limitedQuantity, this.input.quantitySold);
      this.calculateTimeLeft(this.input.limitedEndTime, this.input.startSellingTime, this.input.soldOutTime);
    }
  }

  // from Voucher Details Button component @Output()
  receivedData(data: any) {
    this.timer = setTimeout(() => {
      this.calculateTimeLeft(this.input.limitedEndTime, this.input.startSellingTime, this.input.soldOutTime);
    }, 500);
  }

  // to Voucher Details Button commponent @Input()
  emitData(data) {
    this.buttonStatus.emit(data);
  }

  private calculateQuantityLeft(limitedQuantity, quantitySold) {
    if (!limitedQuantity) {
      return;
    }

    const left = limitedQuantity - quantitySold;
    const progress = Math.round((quantitySold / limitedQuantity) * 100);

    if (quantitySold === 0 && left > 0) {
      this.title = 'Only ' + limitedQuantity + ' vouchers available';
    } else if (left > 0) {
      this.quantityLeft = left;
      this.progress = progress;
      if (progress > 40) {
        this.title = this.quantityLeft + ' Vouchers Left';
        if (left === 1) {
          this.title = this.quantityLeft + ' Voucher Left';
        }
      } else {
        this.title = 'Left ' + this.quantityLeft;
      }
    } else {
      this.quantityLeft = 0;
      this.progress = 100;
      this.title = 'Voucher Sold Out';
      this.hasSoldOut = true;
      this.emitData('SO');
    }
  }

  private calculateTimeLeft(limitedEndTime, startSellingTime, soldOutTime) {
    if (!limitedEndTime && !startSellingTime && !soldOutTime) {
      return;
    }
    limitedEndTime = limitedEndTime ? parseISO(limitedEndTime) : undefined;
    startSellingTime = startSellingTime ? parseISO(startSellingTime) : undefined;
    soldOutTime = soldOutTime ? parseISO(soldOutTime) : undefined;

    // if vouchers has sold out
    if (this.hasSoldOut && soldOutTime) {
      this.timeLeftTitle = 'Sold Out ' + this.fromNow(soldOutTime);
      return;
    }
    // if startSellingTime havent start
    if (startSellingTime && isBefore(new Date(), startSellingTime)) {
      // if voucher both has startSellingTime and LimitedEndTime
      if (limitedEndTime) {
        this.timeLeftTitle = 'Limited Time: ' + formatDistance(startSellingTime, limitedEndTime);
        return;
      } else {
        this.noCard = true;
        this.emitData('WG');
        return;
      }
    } else if (limitedEndTime) {
      // Only limitedEndTime
      const timeSlot = this.setTimeSlot(limitedEndTime);
      this.timeLeftTitle = 'Time Left: ' + timeSlot;
      if (isBefore(new Date(), limitedEndTime)) {
        this.intervalId = setInterval(() => {
          const timeSlot1 = this.setTimeSlot(limitedEndTime);
          this.timeLeftTitle = 'Time Left: ' + timeSlot1;
          if (timeSlot1 === '00:00:00:00' || timeSlot1.slice(-3)[0] === '-') {
            clearInterval(this.intervalId);
            this.timeLeftTitle = 'Offer Just Ended';
            this.limitTimeOver = true;
            this.emitData('LO');
            return;
          }
        }, 1000);
      } else {
        this.timeLeftTitle = 'Offer Ended ' + this.fromNow(limitedEndTime);
        this.limitTimeOver = true;
        this.emitData('LO');
        return;
      }
    } else {
      this.noCard = true;
      return;
    }
  }

  private fromNow(time) {
    if (time) {
      return formatDistanceStrict(new Date(), time) + ' ago';
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

}
