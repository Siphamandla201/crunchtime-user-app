import { Injectable } from '@angular/core';
import {State, Action, StateContext, Selector} from '@ngxs/store';
import {Addresses} from "../../models/addresses.model";
import {AddressesRetrieval} from "src/core/models/addresses-retrieval.model";
import {AddressesService} from "src/core/services/addresses.service";
import {tap} from 'rxjs/operators';
import { AddAddress, GetAddresses } from '../actions/addresses.action';

export class AddressesStateModel {
    addresses: AddressesRetrieval[] = [];
    selectedAddress!: AddressesRetrieval;
    loading: boolean = false;
}

@State<AddressesStateModel>({
    name: 'addresses',
    defaults: {
        addresses: [],
        selectedAddress: null!,
        loading: false
    }
})

@Injectable({
    providedIn: 'root'
})
export class AddressesState {

    constructor(private addressesService: AddressesService) {
    }

    @Selector()
    static getAddresses(state: AddressesStateModel) {
        return state.addresses;
    }

    @Selector()
    static getSelectedAddress(state: AddressesStateModel) {
        return state.selectedAddress;
    }

    @Selector()
    static getLoading(state: AddressesStateModel) {
        return state.loading;
    }

    @Action(AddAddress)
    @Action(AddAddress)
    async addFavourite({ patchState }: StateContext<AddressesStateModel>, { model }: AddAddress) {
        console.log(model);
        try {
            const result = await this.addressesService.addAddress(model);
            console.log(result);
            
            // Check if result is defined and not empty
            if (result && result.length > 0) {
                patchState({
                    addresses: result,
                    selectedAddress: result.find((address: AddressesRetrieval) => address.selected == true)
                });
            }
        } catch (error) {
            console.error('Error adding address:', error);
        }
    }
    

    @Action(GetAddresses)
    getAddresses({getState, setState}: StateContext<AddressesStateModel>) {
        const state = getState();
        return this.addressesService.getAddresses().pipe(tap((result) => {

            setState({
                ...state,
                addresses: result,
                selectedAddress: result.filter(address => address.selected == true)[0]
            });
        }));
    }

}