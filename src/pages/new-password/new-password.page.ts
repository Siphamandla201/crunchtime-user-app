import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CommonAlertService} from "../../core/services/common-alert.service";
import {Router} from "@angular/router";
import {AlertController, NavController} from "@ionic/angular";
import {AccountResourceService} from "../../core/services/account-resource.service";
import {PasswordValidator} from "../../validators";
import {IPasswordResetModel} from "../../core/models/password-reset.model";

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.page.html',
  styleUrls: ['./new-password.page.scss'],
})
export class NewPasswordPage implements OnInit {
  public form!: FormGroup;
  public emailAddress: string;
  

  constructor(
    private readonly _navCtrl: NavController,
    private readonly _formBuilder: FormBuilder,
    private readonly _accountResourceService: AccountResourceService,
    private readonly _commonAlertService: CommonAlertService,
    private readonly _router: Router,
    private _alertController: AlertController
  ) {
    this.emailAddress = localStorage.getItem('email');
  }

  public ngOnInit() {
    this.initializeFormBuilder();
  }

  public initializeFormBuilder() {
    this.form = this._formBuilder.group({
      password: [
        '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(50), PasswordValidator.validPassword]
      ],
      confirmPassword: [
        '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(50), PasswordValidator.validPassword]
      ]
    }, {Validators: this.checkPassword('password', 'confirmPassword')});
  }

  public async resetPasswordOnTap(): Promise<void> {
    if (!this.form.valid) {
      await this._commonAlertService.invalidFormPopup();
      return;
    }

    if (this.form.value.password !== this.form.value.confirmPassword) {
      await this._commonAlertService.popup('Error', 'Password does not match.');
      return;
    }
    try {
      const model: IPasswordResetModel = {
        emailAddress: this.emailAddress.trim(),
        newPassword: this.form.value.password
      }
        await this._accountResourceService.resetPassword(model);
        await this.successAlert("Password successfully changed")
      // await this._router.navigate(['/login']);
    } catch (error) {
      console.warn(error);
    }
  }

  public moveBackOnTap(): void {
    this._navCtrl.back();
  }

  public checkPassword(passwordKey: string, confirmPasswordKey: string) {
    console.log(passwordKey, confirmPasswordKey)
  }

  public async successAlert(msg: string): Promise<void> {
    const alert = await this._alertController.create({
      cssClass: 'custom-alert',
      header: 'Success',
      message: msg,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          cssClass: 'btn-primary',
          handler: async () => {
            await this._router.navigate(['/login']);
          }
        }
      ]
    });

    await alert.present();
  }

}
