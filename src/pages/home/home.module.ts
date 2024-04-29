import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {IonicModule, NavParams} from '@ionic/angular';
import { HomeRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';
import {MenuItemsService} from "../../core/services/menu-items.service";
import {HttpClientModule} from "@angular/common/http";
import {JwtService} from "../../core/services/jwt.service";
import {LocalStorageService, SessionStorageService} from "ngx-webstorage";
import {EstablishmentService} from "../../core/services/establishment.service";
import {ComponentsModule} from "../../components/components.module";
// import {FCM} from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import {PushNotificationResourceService} from 'src/core/services/push-notification-resource.service';
// import {BackgroundMode} from '@ionic-native/background-mode/ngx';
// import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
// import {CategoriesComponent} from "../../components/categories/categories.component";
// import {FullscreenLoaderComponent} from "../../components/fullscreen-loader/fullscreen-loader.component";
// import {HomePageLoaderComponent} from "../../components/home-page-loader/home-page-loader.component";
// import {MenuItemsComponent} from "../../components/menu-items";
// import {EstablishmentMenuItemsComponent} from "../../components/establishment-menu-items";
import { Ng2SearchPipeModule } from 'ng2-search-filter';
// import { AgmCoreModule } from '@agm/core';
// import { AgmDirectionModule } from 'agm-direction';
import { DistanceFilterPipe } from 'src/shared/distanceFilter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    // Ng2SearchPipeModule,
    // AgmCoreModule,
    // AgmDirectionModule,
    // StoreModule.forFeature('myfavourites', favouriteReducer),
    // EffectsModule.forFeature([FavouritesEffect]),
  ],
    declarations: [
      HomePage, 
      // CategoriesComponent, 
      // FullscreenLoaderComponent, 
      // MenuItemsComponent, 
      // EstablishmentMenuItemsComponent, 
      // HomePageLoaderComponent,
      DistanceFilterPipe,
      // SearchResultsComponent
    ],
  exports: [
    DistanceFilterPipe,
    // MenuItemsComponent
  ],
  providers: [
    // FCM,
    // StatusBar,
    // SplashScreen,
    // LocalNotifications,
    // BackgroundMode,
    // PushNotificationResourceService,
    EstablishmentService,
    MenuItemsService,
    JwtService,
    SessionStorageService,
    LocalStorageService,
    NavParams
  ]
})

export class HomePageModule{}