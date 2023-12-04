import { CommonService } from '../../../providers/common/common.service';
import { Component, Input } from '@angular/core';
import { ContactValidator } from '../../../validators/contact.validator';
import { DataService } from '../../../providers/data-service/data.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { AuthenticationService } from './../../../providers/authentication/authentication.service';

@Component({
  selector: 'reservation-input',
  templateUrl: 'reservation-input.html'
})
export class ReservationInputComponent {

  @Input('reservationInput') input: any;

  // input from other Component
  datePicked: any;

  // Properties
  min: number;
  max: number;

  // Form variables
  form: FormGroup;

  // Remark properties
  remarkList = [];

  constructor(
    public formBuilder: FormBuilder,
    public dataService: DataService,
    public commonService: CommonService,
    public authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.form = this.setUpForm();
    this.onChanges();
    if (this.authenticationService.checkLoginStatus()) {
      this.form.get('contactInput').setValue(this.authenticationService.currentUserValue.contact);
    }
  }

  ngOnChanges() {
    if (this.input) {
      this.min = this.input.paxSettings.minPax;
      this.max = this.input.paxSettings.maxPax;
      this.setUpRemarkManual(this.input.remarkManual);
      this.form.get('myPax').setValidators([Validators.required, Validators.min(this.min), Validators.max(this.max)]);
    }
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private setUpForm() {
    return this.formBuilder.group({
      myPax: [''],
      myTime: ['', Validators.required],
      nameInput: ['', Validators.required],
      contactInput: ['', Validators.compose([
        ContactValidator.validCountryPhone(),
        Validators.required
      ])],
      remarkInput: [''],
      extraRemark: ['']
    });
  }

  private onChanges() {
    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      this.dataService.changeReservation({
        form: this.form
      });
    });
    this.form.get('myPax').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (val < this.min || val > this.max) {
        this.commonService.presentToast(`Pax need to in range (${this.min} - ${this.max} people)`);
      }
    });
  }

  private setUpRemarkManual(remarkManual) {
    if (remarkManual) {
      this.remarkList = remarkManual.map(val => val.remarkDetails[0].remarkName);
      this.form.get('extraRemark').setValue(this.remarkList);
    }
  }

  selectChanged(details, parentIndex, childIndex) {
    if (Array.isArray(childIndex)) {
      this.remarkList[parentIndex] = [];
      childIndex.map(val => {
        this.remarkList[parentIndex].push(details[Number(val)].remarkName);
        this.form.get('extraRemark').setValue(this.remarkList);
      });
    } else {
      this.remarkList[parentIndex] = details[Number(childIndex)].remarkName;
      this.form.get('extraRemark').setValue(this.remarkList);
    }
  }

}
