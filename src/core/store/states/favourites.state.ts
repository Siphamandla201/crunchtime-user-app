import { Injectable } from '@angular/core';
import {State, Action, StateContext, Selector} from '@ngxs/store';
import {FavouritesRetrievalModel} from '../../models/favourites-retrieval.model';
import {IEstablishmentRetrievalModel} from '../../models/establishment-retrieval.model';
import {AddFavourite, DeleteFavourite, GetFavourites, SetSelectedFavourite, GetFavouriteEstablishments} from '../actions/favourites.action';
import {FavouritesService} from '../../services/favourites.service';
import {tap} from 'rxjs/operators';

export class FavouriteStateModel {
    favourites: FavouritesRetrievalModel[] = [];
    favouriteEstablishments: number[] = [];
    selectedFavourite: FavouritesRetrievalModel = new FavouritesRetrievalModel;
    loading: boolean = false;
}

@State<FavouriteStateModel>({
    name: 'favourites',
    defaults: {
        favourites: [],
        favouriteEstablishments: [],
        selectedFavourite: null!,
        loading: false
    }
})

@Injectable({
    providedIn: 'root'
})
export class FavouriteState {

    constructor(private favouritesService: FavouritesService) {
    }

    @Selector()
    static getFavourites(state: FavouriteStateModel) {
        return state.favourites;
    }

    @Selector()
    static getFavouriteEStablishments(state: FavouriteStateModel) {
        return state.favouriteEstablishments;
    }

    @Selector()
    static getSelectedFavourite(state: FavouriteStateModel) {
        return state.selectedFavourite;
    }

    @Selector()
    static getLoading(state: FavouriteStateModel) {
        return state.loading;
    }

    @Action(GetFavourites)
    getFavourites({getState, setState}: StateContext<FavouriteStateModel>) {
        const state = getState();
        setState({
            ...state,
            loading:true
        })
        return this.favouritesService.getFavourites().pipe(tap((result) => {
            
            let favouriteEstablish: any[] = []
            
            result.forEach(item => {
                let add = true
                if(favouriteEstablish[0]){
                    favouriteEstablish.forEach(thing => {
                        if(item.establishmentId == thing){
                            add = false
                        }
                    })
                }

                if(add){
                    favouriteEstablish.push(item.establishmentId)
                }
            })
            setState({
                ...state,
                favourites: result,
                favouriteEstablishments: favouriteEstablish,
                loading:false
            });
        }));
    }

    @Action(GetFavouriteEstablishments)
getEstablishments({ getState, setState }: StateContext<FavouriteStateModel>) {
    const state = getState();
    let favouriteEstablish: number[] = []; // Initialize favouriteEstablish here

    state.favourites.forEach(item => {
        let add = true; // Corrected logic to add the establishmentId by default
        if (favouriteEstablish.length > 0) {
            favouriteEstablish.forEach(thing => {
                if (item.establishmentId === thing) {
                    add = false; // Should set add to false if the establishmentId is already in favouriteEstablish
                }
            });
        }
        if (add) {
            favouriteEstablish.push(item.establishmentId);
        }
    });
    setState({
        ...state,
        favouriteEstablishments: favouriteEstablish
    });
}


    @Action(AddFavourite)
    async addFavourite({getState, patchState}: StateContext<FavouriteStateModel>, {id}: AddFavourite) {
        return (await this.favouritesService.addToFavourites(id)).pipe(tap((result) => {
            const state = getState();
            const newFavourites = [...state.favourites, result[0]]
            let favouriteEstablish: any[] = []
            
            newFavourites.forEach(item => {
                let add = true
                if(favouriteEstablish[0]){
                    favouriteEstablish.forEach(thing => {
                        if(item.establishmentId == thing){
                            add = false
                        }
                    })
                }

                if(add){
                    favouriteEstablish.push(item.establishmentId)
                }
            })
            patchState({
                favourites: [...state.favourites, result[0]],
                favouriteEstablishments: favouriteEstablish
            });
        }));
    }


    @Action(DeleteFavourite)
    async deleteFavourite({getState, patchState}: StateContext<FavouriteStateModel>, {id}: DeleteFavourite) {
        return (await this.favouritesService.removeFromFavourites(id)).pipe(tap(() => {
            const state = getState();
            const filteredArray = state.favourites.filter(item => item.itemId !== id);
            
            let favouriteEstablish: any[] = []
            
            filteredArray.forEach(item => {
                let add = true
                if(favouriteEstablish[0]){
                    favouriteEstablish.forEach(thing => {
                        if(item.establishmentId == thing){
                            add = false
                        }
                    })
                }

                if(add){
                    favouriteEstablish.push(item.establishmentId)
                }
            })
            patchState({
                favourites: filteredArray,
                favouriteEstablishments: favouriteEstablish
            });
        }));
    }

    @Action(SetSelectedFavourite)
    setSelectedTodoId({getState, setState}: StateContext<FavouriteStateModel>, {payload}: SetSelectedFavourite) {
        const state = getState();
        setState({
            ...state,
            selectedFavourite: payload
        });
    }  
}