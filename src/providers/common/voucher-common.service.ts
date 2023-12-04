import { Injectable } from '@angular/core';
import { format, parseISO, formatDistanceStrict, subDays, isWithinInterval, isAfter } from 'date-fns';

@Injectable()
export class VoucherCommonService {

  constructor() { }

  processTicket(list) {
    if (!list) {
      return [];
    }
    return list.map(val => {
      if (this.checkIsVoucher(val.status)) {
        const vo = val.voucherDetails;
        return {
          _id: val._id,
          status: val.status,
          restaurantId: val.restaurantId,
          restaurantName: val.restaurantName,
          isExpired: this.checkExpiry(val, 'V'),
          expireWarn: this.getExpireWarn(val, 'V'),
          voucherId: val.voucherId,
          voucherImage: vo.voucherImage,
          voucherName: vo.voucherName,
          newPrice: vo.newPrice,
          basePrice: vo.basePrice,
          buttonText: this.updateButtonText(val.status),
          isVoucher: true
        };
      } else {
        const re = val.reservationDetails;
        const timeString = format(parseISO(re.dateTime), 'hh:mm a');
        return {
          _id: val._id,
          status: val.status,
          restaurantId: val.restaurantId,
          restaurantName: val.restaurantName,
          isExpired: this.checkExpiry(val, 'R'),
          expireWarn: this.getExpireWarn(val, 'R'),
          restaurantImage: re.restaurantImage,
          date: this.getDate(re.dateTime),
          time: this.getTime(timeString),
          section: this.getSection(timeString),
          notificationId: re.notificationId,
          buttonText: this.updateButtonText(val.status),
          isVoucher: false
        };
      }
    });
  }

  private checkIsVoucher(statusName) {
    switch (statusName) {
      case 'HV': return true;
      case 'PU': return true;
      case 'PC': return true;
      default: return false;
    }
  }

  private getDate(dateTime) {
    return format(parseISO(dateTime), 'do MMM yyyy');
  }

  private getTime(timeString: string) {
    return (timeString.charAt(0) === '0') ? timeString.substr(1).slice(0, -2) : timeString.slice(0, -2);
  }

  private getSection(timeString: string) {
    return timeString.substr(timeString.length - 2);
  }

  private updateButtonText(statusName) {
    switch (statusName) {
      case 'PU':
      case 'RE':
      case 'HV':
      case 'HR': return 'View';
      case 'PC': return 'Write';
    }
  }

  private getExpireWarn(val, type) {
    if (val.expiredDate) {
      return undefined;
    }
    if (type === 'V') {
      const MED = val.purchaseDetails.monthlyExpiryDate;
      if (MED) {
        return this.checkDateWithin(MED);
      }
      return this.checkDateWithin(val.voucherDetails.validUntil);
    } else {
      return this.checkDateWithin(val.reservationDetails.dateTime);
    }
  }

  private checkDateWithin(dateISO) {
    const date = parseISO(dateISO);
    const threeDayBefore = subDays(date, 3);
    if (isWithinInterval(new Date(), { start: threeDayBefore, end: date })) {
      return 'Expire in ' + formatDistanceStrict(date, new Date());
    }
  }

  private checkExpiry(item, type) {
    const ED = item.expiredDate;
    const EDISO = parseISO(ED);
    if (type === 'V') {
      const MED = item.purchaseDetails.monthlyExpiryDate;
      if (MED && isAfter(new Date(), parseISO(MED))) {
        return true;
      } else if (ED && isAfter(new Date(), EDISO)) {
        return true;
      }
      return false;
    } else {
      return ED && isAfter(new Date(), EDISO);
    }
  }
}
