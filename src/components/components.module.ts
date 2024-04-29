import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Angular modules
import { HttpClientModule } from '@angular/common/http'; // Angular modules
import { IonicModule } from '@ionic/angular'; // Third-party modules
import { RouterModule } from '@angular/router'; // Angular modules
// import { Ng2SearchPipeModule } from 'ng2-search-filter'; // Third-party 


// Components
import { HeaderComponent } from './header/header.component';
import { FormControlErrorComponent } from './form-control-error';
import { IFrame3DSFormComponent } from './iframe-3ds-form';
import { IFrameNedbankFormComponent } from './iframe_nedbank_form';
import { SingleMunuItemComponent } from './single-munu-item/single-munu-item.component';
import { RestaurantPageLoaderComponent } from './restaurant-page-loader/restaurant-page-loader.component';
import { CurrentlyUnavailableComponent } from './currently-unavailable/currently-unavailable.component';
// import { SearchResultsComponent } from './search-results/search-results.component';
// import { AccountDetailsComponent } from './account-details/account-details.component';
// import { BottomNuvComponent } from './bottom-nuv/bottom-nuv.component';
import { CategoriesComponent } from './categories/categories.component';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { ConversationComponent } from './conversation/conversation.component';
import { ConversationsMessagesComponent } from './conversations-messages';
import { MessageBubbleComponent } from './message-bubble/message-bubble.component';
import { EstablishmentMenuItemsComponent } from './establishment-menu-items';
import { FullscreenLoaderComponent } from './fullscreen-loader/fullscreen-loader.component';
import { MenuItemsComponent } from './menu-items';
import { NoDriversAvailableComponent } from './no-drivers-available/no-drivers-available.component';
import { ShowBankingDetailComponent } from './show-banking-details/show-banking-detail.component';
import { ShowHidePasswordComponent } from './show-hide-password';
import { VoucherModalComponent } from './voucher-modal';

// import { MapComponent } from './map/map.component';


@NgModule({
  declarations: [
    HeaderComponent,
    FormControlErrorComponent,
    IFrame3DSFormComponent,
    IFrameNedbankFormComponent,
    SingleMunuItemComponent,
    RestaurantPageLoaderComponent,
    CurrentlyUnavailableComponent,
    // SearchResultsComponent,
    // AccountDetailsComponent,
    // BottomNuvComponent,
    CategoriesComponent,
    ConfirmationModalComponent,
    ConversationComponent,
    ConversationsMessagesComponent,
    MessageBubbleComponent,
    EstablishmentMenuItemsComponent,
    FullscreenLoaderComponent,
    MenuItemsComponent,
    NoDriversAvailableComponent,
    ShowBankingDetailComponent,
    ShowHidePasswordComponent,VoucherModalComponent,
    // MapComponent,
  ],
  exports: [
    HeaderComponent,
    FormControlErrorComponent,
    IFrame3DSFormComponent,
    IFrameNedbankFormComponent,
    SingleMunuItemComponent,
    RestaurantPageLoaderComponent,
    // SearchResultsComponent,
    // AccountDetailsComponent,
    // BottomNuvComponent,
    // CategoriesComponent,
    ConfirmationModalComponent,
    ConversationComponent,
    ConversationsMessagesComponent,
    MessageBubbleComponent,
    EstablishmentMenuItemsComponent,
    // FullscreenLoaderComponent,
    MenuItemsComponent,
    NoDriversAvailableComponent,
    ShowBankingDetailComponent,
    ShowHidePasswordComponent,
    VoucherModalComponent,
    // MapComponent
  ],
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule, 
    IonicModule,
    RouterModule,
    // Ng2SearchPipeModule
  ],
})
export class ComponentsModule {}
