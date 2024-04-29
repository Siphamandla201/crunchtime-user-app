import { AbstractControl } from '@angular/forms';

export class PhoneNumberValidator {
    public static validPhoneNumber(control: AbstractControl): { validPhoneNumber: boolean } | null{
        const phoneNumberRegEx = RegExp('^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$');

        if (control.value) {
            if (!phoneNumberRegEx.test(control.value)) {
                return {
                    validPhoneNumber: true
                };
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
}
