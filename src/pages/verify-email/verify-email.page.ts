import { Component } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage {

  public emailAddress: string;

  public constructor (
    private readonly _activeRoute: ActivatedRoute
  ) {
    const emailAddressParam = this._activeRoute.snapshot.paramMap.get('emailAddress');
    this.emailAddress = emailAddressParam ? emailAddressParam : '';
  }

  openEmailOnTap() {
    const emailAddressParam = this._activeRoute.snapshot.paramMap.get('emailAddress');
    this.emailAddress = emailAddressParam ? emailAddressParam : '';
  }

}
