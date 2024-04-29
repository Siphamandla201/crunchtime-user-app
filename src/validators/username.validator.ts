import { AbstractControl } from '@angular/forms';

export class UsernameValidator {
    public static validUsername(control: AbstractControl): { validUsername: boolean } | null {
        const emailRegEx = RegExp('^[_.@A-Za-z0-9-]*$');

        if (!emailRegEx.test(control.value)) {
            return {
                validUsername: true
            };
        } else {
            return null;
        }
    }
}
