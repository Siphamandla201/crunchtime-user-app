import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RegisterPageRoutingModule } from './register-routing.module';
import { RegisterPage } from './register.page';
import { AuthenticateResourceService } from "../../core/services/authenticate-resource.service";
import { JwtService} from "../../core/services/jwt.service";
import { LocalStorageService, SessionStorageService } from "ngx-webstorage";
import { AccountResourceService } from "../../core/services/account-resource.service";
import { HttpClientModule } from "@angular/common/http";
import {ComponentsModule} from "../../components/components.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RegisterPageRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
        ComponentsModule
    ],
  declarations: [RegisterPage],
  providers: [
    AuthenticateResourceService,
    AccountResourceService,
    JwtService,
    SessionStorageService,
    LocalStorageService
  ]
})
export class RegisterPageModule {}
