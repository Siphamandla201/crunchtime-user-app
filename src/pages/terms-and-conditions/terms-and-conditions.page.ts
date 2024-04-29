import { Component, OnInit } from '@angular/core';
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.page.html',
  styleUrls: ['./terms-and-conditions.page.scss'],
})
export class TermsAndConditionsPage implements OnInit {

  constructor(private readonly _navCtrl: NavController) { }

  ngOnInit() {
  }

  public moveBackOnTap(): void {
      this._navCtrl.back();
  }
}
