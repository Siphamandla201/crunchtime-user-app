import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthenticateResourceService } from "../../core/services/authenticate-resource.service";
import { JwtService } from "../../core/services/jwt.service";
import { HttpClientModule } from "@angular/common/http";
import { LocalStorageService, SessionStorageService } from "ngx-webstorage";
import {MapPageRoutingModule} from "./map-routing.module";
import {MapComponent} from "./map.component";
// import {AgmCoreModule} from "@agm/core";
// import {AgmDirectionModule} from "agm-direction";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MapPageRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
        // AgmCoreModule,
        // AgmDirectionModule
    ],
  declarations: [MapComponent],
  exports: [
    MapComponent
  ],
  providers: [
    AuthenticateResourceService,
    JwtService,
    SessionStorageService,
    LocalStorageService
  ]
})
export class MapPageModule {}
