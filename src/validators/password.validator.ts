import { AbstractControl, ValidatorFn } from '@angular/forms';

export class PasswordValidator {
    public static matchPassword(passwordName: string, confirmPasswordName: string): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            const passwordControl = control.get(passwordName);
            const confirmPasswordControl = control.get(confirmPasswordName);

            if (!passwordControl || !confirmPasswordControl) {
                // Return null if either control is not found
                return null;
            }

            const password = passwordControl.value; // Get value from password control
            const confirmPassword = confirmPasswordControl.value; // Get value from confirmPassword control

            if (password !== confirmPassword) {
                // Set error if passwords do not match
                confirmPasswordControl.setErrors({ matchPassword: true });
                return { matchPassword: true };
            } else {
                // Return null if passwords match
                return null;
            }
        };
    }


    public static validPassword(control: AbstractControl): { validPassword: boolean } | null{
        const passwordRegEx = RegExp('^(?=.*\\d)(?=.*[A-Z]).{6,30}$');

        if (!passwordRegEx.test(control.value)) {
            return {
                validPassword: true
            };
        } else {
            return null;
        }
    }
}
