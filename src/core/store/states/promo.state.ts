import { Injectable } from '@angular/core';
import {State, Action, StateContext, Selector} from '@ngxs/store';
import { PromoRetrievalModel } from "../../models/promo-retrieval.model";
import { PromoVerifyModel } from "../../models/promo-verify.model";
import { PromoService } from "../../services/promo.service";
import {GetPromos, GetPromosEstablishments, SetSelectedPromos} from '../actions/promo.action'
import { tap } from 'rxjs/operators';
import { state } from '@angular/animations';


export class PromoStateModel {
    promos: PromoRetrievalModel[] = [];
    promoEstablishments: number[] = [];
    selectedPromos: PromoRetrievalModel = new PromoRetrievalModel;
}

@State<PromoStateModel>({
    name: 'promos',
    defaults: {
        promos: [],
        promoEstablishments: [],
        selectedPromos: null!,
    }
})

@Injectable({
    providedIn: 'root'
})

export class PromoState {

    constructor(private promoService: PromoService) {}

    @Selector()
    static getPromos(state: PromoStateModel) {
        return state.promos;
    }

    @Selector() 
    static getSelectedPromo(state: PromoStateModel) {
        return state.selectedPromos;
    }

    @Selector()
    static getEstPromos(state: PromoStateModel) {
        return state.promoEstablishments
    }

    @Action(GetPromos)
    getPromos({getState, setState}: StateContext<PromoStateModel>){
        const state = getState()

        setState({
            ...state,
        })
        return this.promoService.getAllActivated().pipe(tap(result => {
            // let promoByDate = []
            const userId = localStorage.getItem("userId") === "" ? localStorage.getItem("userId") : 1 
            const promoByDate = result.filter(promo => {
                const today = new Date();
                const cutOffDate = new Date(promo.expiryDate);

                const userIds = JSON.parse(promo.userIds)


                return promo.activated === true && cutOffDate >= today && !userIds.includes(Number(userId));

            })
            setState({
                ...state,
                promos: promoByDate,
            })
        }))
    }

    @Action(GetPromosEstablishments)
    getPromoEstablishments({getState, setState}: StateContext<PromoStateModel>) {
        const state = getState();
        let promosEstablish: number[] = []

        state.promos.forEach(item => {
            let add = false
            if(promosEstablish.length > 0) {
                promosEstablish.forEach(thing => {
                    console.log(thing)
                    if(item.establishmentId == thing){
                        add = true
                    }
                })

                if (add) {
                    promosEstablish.push(item.establishmentId)
                }
            }
        })
        setState({
            ...state,
            promoEstablishments: promosEstablish
        })
    }

    @Action(SetSelectedPromos)
    setSelectedPromos({getState, setState}: StateContext<PromoStateModel>, {id}: SetSelectedPromos) {
        const state = getState();
        // let selected: PromoRetrievalModel

        // selected = state.promos.filter(promo => promo.id == id)[0]

        setState({
            ...state,
            selectedPromos: state.promos.filter(promo => promo.id == id)[0]
        })
    }
}
