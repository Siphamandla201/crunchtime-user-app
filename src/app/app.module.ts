import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { AddressesState } from 'src/core/store/states/addresses.state';
import { CartState } from 'src/core/store/states/cart.state';
import { EstablishmentState } from 'src/core/store/states/establishments.state';
import { EstablishmentNearYouState } from 'src/core/store/states/establishmentsNearYou.state';
import { FavouriteState } from 'src/core/store/states/favourites.state';
import { MenuItemsState } from 'src/core/store/states/menuItems.state';
import { PromoState } from 'src/core/store/states/promo.state';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { AccountResourceService } from "../core/services/account-resource.service";
import { JwtService } from "../core/services/jwt.service";

import { AuthExpiredInterceptor } from "../core/interceptors/auth-expired.interceptor";
import { ErrorHandlerInterceptor } from "../core/interceptors/error-handler.interceptor";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthInterceptor } from 'src/core/interceptors/auth.interceptor';
import { BottomNuvComponent } from 'src/components/bottom-nuv/bottom-nuv.component';

// Pages 
import { LoginPage } from 'src/pages/login/login.page';

@NgModule({
  declarations: [AppComponent, BottomNuvComponent],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideAnimationsAsync(),
    JwtService,
    SessionStorageService,
    LocalStorageService,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthExpiredInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule, // Include HttpClientModule here
    NgxsModule.forRoot([
      FavouriteState,
      EstablishmentState,
      EstablishmentNearYouState,
      CartState,
      MenuItemsState,
      PromoState,
      AddressesState
    ]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
  ]
})
export class AppModule { }

