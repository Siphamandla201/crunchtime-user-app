import { AbstractControl } from '@angular/forms';

export class EmailValidator {
    public static validEmail(control: AbstractControl): { validEmail: boolean } | null  {
        const emailRegEx = RegExp('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$');
       
        if (control.value) {
            let isWhitespace = (control.value || '').trim().length === 0;
            let isValid = !isWhitespace;
            if (isValid) {
                return isValid ? null : { validEmail: true }
            }
            if (!emailRegEx.test(control.value)) {
                return {
                    validEmail: true
                };
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
}
