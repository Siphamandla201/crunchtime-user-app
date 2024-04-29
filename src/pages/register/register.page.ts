import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from "@ionic/angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router} from "@angular/router";
import { CommonAlertService } from "../../core/services/common-alert.service";
import { AccountResourceService } from "../../core/services/account-resource.service";
import { IAccountCreationModel } from "../../core/models/account-creation.model";
import {PhoneNumberValidator} from "../../validators/phone-number.validator";
import {EmailValidator, PasswordValidator} from "../../validators";
// import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public form!: FormGroup;
  public loadingRequest!: boolean;
  public saving!: boolean;
  public checked: boolean = false;

  public constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _router: Router,
    private readonly _alertController: AlertController,
    private readonly _commonAlertService: CommonAlertService,
    private readonly _accountResourceService: AccountResourceService,
    private readonly _navCtrl: NavController
  ) {}

  public ngOnInit(): void {
    this.initializeFormBuilder();
  }

  public initializeFormBuilder() {
    this.form = this._formBuilder.group({
      username:['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      fullName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      password: [
        '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(50), PasswordValidator.validPassword]
      ],
      emailAddress: [
        '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(254), EmailValidator.validEmail]
      ],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(20),
          PhoneNumberValidator.validPhoneNumber
        ]
      ]
    });
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
            await this._router.navigate(['/']);
          }
        }
      ]
    });

    await alert.present();
  }

  public async successAlertRegister(msg: string): Promise<void> {
    const alert = await this._alertController.create({
      cssClass: 'custom-alert',
      header: 'One last step',
      message: msg,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          cssClass: 'btn-primary',
          // handler: async () => {
          //   await this._router.navigate(['/otp', {emailAddress: this.form.value.emailAddress, username: this.form.value.username, password: this.form.value.password}])
          // }
        }
      ]
    });

    await alert.present();
  }

  public async isChecked(event: { target: { checked: boolean; }; }) {
    if (event.target.checked === true) {
      this.checked = event.target.checked
    } else {
      this.checked = event.target.checked
    }
  }

  public async registerOnTap(): Promise<void> {
    this.loadingRequest = true;
    this.saving = true;

    if (!this.form.valid) {
      this.loadingRequest = false;
      await this._commonAlertService.invalidFormPopup();
      return;
    }

    if (this.form.value.password.length < 5) {
      this.loadingRequest = false;
      await this._commonAlertService.popup('Error', 'Password has to be greater than six characters');
      return;
    }

    try {
      const model: IAccountCreationModel = {
        username: this.form.value.username.trim(),
        fullName: this.form.value.fullName.trim(),
        password: this.form.value.password,
        phoneNumber: this.form.value.phoneNumber.trim(),
        emailAddress: this.form.value.emailAddress.trim()
      };

      this._accountResourceService.register(model).then(async () => {
        localStorage.setItem("userName", model.username)
        localStorage.setItem("userPass", model.password)
        this.onRequestCompleted();
        this.successAlertRegister('Please check your emails for an OTP that will activate your account')
        await this._router.navigate(['/otp', {emailAddress: this.form.value.emailAddress, username: this.form.value.username, password: this.form.value.password}]);
      }).catch( async e => {
        await this._commonAlertService.popup('Error', e.message)
      });
      
    } catch (e: any) {
      this.onRequestCompleted();
      await this._commonAlertService.popup('Error', e.message);
      console.warn(e);
    }
  }

  public moveBackOnTap(): void {
    this._navCtrl.back();
  }

  public onRequestCompleted(): void {
    this.saving = false;
    this.loadingRequest = false;
  }
}
