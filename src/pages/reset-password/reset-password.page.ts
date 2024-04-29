// import { OtpService } from '/core/services/otp.service';
import { OtpService } from 'src/core/services/otp.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonAlertService } from "../../core/services/common-alert.service";
import { Router } from "@angular/router";
import {NavController} from "@ionic/angular";
import {EmailValidator} from "../../validators";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  public form!: FormGroup;

  constructor(
    private readonly _navCtrl: NavController,
    private readonly _formBuilder: FormBuilder,
    private readonly _otpService: OtpService,
    private readonly _commonAlertService: CommonAlertService,
    private readonly _router: Router
  ) {}

  public ngOnInit() {
    this.initializeFormBuilder();
  }

  public initializeFormBuilder() {
    this.form = this._formBuilder.group({
      emailAddress: [
        '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(254), EmailValidator.validEmail]
      ]
    });
  }

  public async sendEmailOnTap(): Promise<void> {
    if (!this.form.valid) {
      await this._commonAlertService.invalidFormPopup();
      return;
    }

    try {
      await this._otpService.sendOtpForgetPasswordRequest(this.form.value.emailAddress.trim());
      localStorage.setItem('email', this.form.value.emailAddress);
      await this._router.navigate(['password-reset-otp', {emailAddress: this.form.value.emailAddress.trim()}]);
    } catch (e: any) {
      await this._commonAlertService.popup('Error' + 'Error in sendEmailOnTap() ', e);
    }
  }
  public moveBackOnTap(): void {
    this._navCtrl.back();
  }

}
