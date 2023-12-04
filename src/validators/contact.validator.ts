import { AbstractControl, ValidatorFn } from '@angular/forms';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export class ContactValidator {

  static validCountryPhone = (): ValidatorFn => {

    return (phoneControl: AbstractControl): { [key: string]: boolean } => {

      if (phoneControl.value !== '') {
        try {

          const contact = `${phoneControl.value}`;
          const phoneNumber = parsePhoneNumberFromString(contact, 'MY');
          const isValidNumber = phoneNumber.isValid();

          if (isValidNumber && contact.length <= 11) {
            return undefined;
          } else {
            return {
              validCountryPhone: true
            };
          }
        } catch (e) {
          return {
            validCountryPhone: true
          };
        }
      } else {
        return undefined;
      }
    };
  }
}
