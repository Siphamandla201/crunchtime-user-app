import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from "@angular/router";
import { Select } from '@ngxs/store';
import { AddressesState } from 'src/core/store/states/addresses.state';
import { Observable } from 'rxjs';
import { AddressesRetrieval } from 'src/core/models/addresses-retrieval.model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-currently-unavailable',
  templateUrl: './currently-unavailable.component.html',
  styleUrls: ['./currently-unavailable.component.scss'],
})
export class CurrentlyUnavailableComponent implements OnInit {
  @Select(AddressesState.getSelectedAddress)
  public selectedAddress!: Observable<AddressesRetrieval>;

  @Input()
  public location: string = '';

  constructor(
    private readonly _router: Router,
    public modalController: ModalController,
  ) { }

  ngOnInit() {}

  dismiss() {
    this._router.navigate(['/location-selection'])
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}