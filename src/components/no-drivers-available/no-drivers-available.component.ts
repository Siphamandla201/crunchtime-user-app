import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {Router} from "@angular/router";
import { Select } from '@ngxs/store';
import { AddressesState } from 'src/core/store/states/addresses.state';
import { Observable } from 'rxjs';
import { AddressesRetrieval } from 'src/core/models/addresses-retrieval.model';

@Component({
  selector: 'app-no-drivers-available',
  templateUrl: './no-drivers-available.component.html',
  styleUrls: ['./no-drivers-available.component.scss'],
})
export class NoDriversAvailableComponent implements OnInit {
  @Select(AddressesState.getSelectedAddress)
  public selectedAddress!: Observable<AddressesRetrieval>;

  @Input()
  public location: string | undefined;


  constructor(
    private readonly _router: Router,
    public modalController: ModalController,
  ) { }

  ngOnInit() {}
  

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this._router.navigate(['/home'])
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
