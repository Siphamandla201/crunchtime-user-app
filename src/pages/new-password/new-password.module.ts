import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {IonicModule, NavParams} from '@ionic/angular';
import { NewPasswordPageRoutingModule } from './new-password-routing.module';
import { NewPasswordPage } from './new-password.page';
import { ComponentsModule } from "../../components/components.module";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewPasswordPageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule,
    HttpClientModule
  ],
  declarations: [NewPasswordPage],
  providers: [NavParams]
})
export class NewPasswordPageModule {}
