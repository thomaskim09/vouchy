import { Component, Input, Output, EventEmitter } from '@angular/core';
import { isAfter, format, parse, parseISO } from 'date-fns';

@Component({
  selector: 'voucher-detail-rule',
  templateUrl: 'voucher-detail-rule.html'
})
export class VoucherDetailRuleComponent {

  @Input('voucherRules') in: any;

  input: any;
  ruleList: any = [];
  itemOpened: boolean = false;

  @Output() buttonStatus = new EventEmitter();

  constructor() { }

  ngOnChanges() {
    if (this.in) {
      this.input = {
        validFrom: this.formatDate(this.in.validFrom),
        validUntil: this.formatDate(this.in.validUntil),
        startTime: this.formatDateTime(this.in.startTime),
        endTime: this.formatDateTime(this.in.endTime),
        ruleDetails: this.in.ruleDetails,
        customRuleDetails: this.in.customRuleDetails
      };
      this.combineRules();
      this.checkVoucherExpiry();
    }
  }

  // to Voucher Details Button component @Input()
  emitData(data) {
    this.buttonStatus.emit(data);
  }

  private combineRules() {
    this.ruleList = this.input.ruleDetails;
    if (this.input.customRuleDetails && this.input.customRuleDetails.length) {
      this.ruleList = [...this.input.customRuleDetails, ...this.ruleList];
    }
  }

  private checkVoucherExpiry() {
    if (isAfter(new Date(), parseISO(this.in.validUntil))) {
      this.emitData('XP');
    }
  }

  toggleSection() {
    this.itemOpened = !this.itemOpened;
  }

  private formatDate(dateTime) {
    return format(parseISO(dateTime), 'yyyy-MM-dd');
  }

  private formatDateTime(time) {
    const result = format(parse(time, 'HH:mm', new Date()), 'hh:mm a').toLowerCase();
    return (result.charAt(0) === '0') ? result.substr(1) : result;
  }

}
