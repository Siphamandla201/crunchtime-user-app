import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginPageRoutingModule } from './login-routing.module';
import { LoginPage } from './login.page';
import { AuthenticateResourceService } from 'src/core/services/authenticate-resource.service';
import { JwtService } from 'src/core/services/jwt.service';
import { LocalStorageService, SessionStorageService } from "ngx-webstorage";
import { OrderService } from 'src/core/services/order.service';
import { AccountResourceService } from 'src/core/services/account-resource.service';
import { ComponentsModule } from "../../components/components.module";
// import { HttpClientModule } from '@angular/common/http';


@NgModule({
    declarations: [LoginPage],
    providers: [
        OrderService,
        AccountResourceService,
        AuthenticateResourceService,
        JwtService,
        SessionStorageService,
        LocalStorageService
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        // HttpClientModule,
        LoginPageRoutingModule,
        ComponentsModule
    ]
})
export class LoginPageModule {}
