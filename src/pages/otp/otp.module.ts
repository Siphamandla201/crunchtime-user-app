import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {IonicModule, NavParams} from '@ionic/angular';
import { OtpPageRoutingModule } from './otp-routing.module';
import { OtpPage } from './otp.page';
import { ComponentsModule } from "../../components/components.module";
// import { AngularOtpLibModule } from "angular-otp-box";
import { OtpService } from "../../core/services/otp.service";
import { HttpClientModule } from "@angular/common/http";
import { JwtService } from 'src/core/services/jwt.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OtpPageRoutingModule,
    ComponentsModule, 
    ReactiveFormsModule,
    // AngularOtpLibModule,
    HttpClientModule
  ],
  declarations: [OtpPage],
  providers: [OtpService, NavParams, JwtService]
})
export class OtpPageModule {}
