import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule, NavParams} from '@ionic/angular';

import { UserProfilePageRoutingModule } from './user-profile-routing.module';

import { UserProfilePage } from './user-profile.page';
import {HttpClientModule} from "@angular/common/http";
import {OrderService} from "../../core/services/order.service";
import {JwtService} from "../../core/services/jwt.service";
import {LocalStorageService, SessionStorageService} from "ngx-webstorage";
import {AccountResourceService} from "../../core/services/account-resource.service";
// import {BottomNuvComponent} from "../../components/bottom-nuv/bottom-nuv.component";
import {AccountDetailsComponent} from "../../components/account-details/account-details.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserProfilePageRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  declarations: [UserProfilePage,AccountDetailsComponent],
  providers: [
    AccountResourceService,
    JwtService,
    SessionStorageService,
    LocalStorageService,
    NavParams
  ]
})
export class UserProfilePageModule {}
