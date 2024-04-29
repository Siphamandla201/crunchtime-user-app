import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs/operators";
import { EstablishmentService } from "src/core/services/establishment.service";
import { GetNearYouEstablishments, SetEstablishmentsNearYou } from "../actions/establishmentsNearYou.action";

export class EstablishmentsNearYouStateModel {
  establishmentsNearYou: any[] = [];
  loading: boolean = false;
}

@State<EstablishmentsNearYouStateModel>({
    name: 'establishmentsNearYou',
    defaults: {
      establishmentsNearYou: [],
      loading: false,
    },
  })
@Injectable({
providedIn: 'root',
})

export class EstablishmentNearYouState {
    constructor(private establishmentService: EstablishmentService) {}
    @Selector() 
    static getEstablishmentsNearYou(state: EstablishmentsNearYouStateModel) {
        return state.establishmentsNearYou;
    }
    @Selector()
    static getLoading(state: EstablishmentsNearYouStateModel) {
        return state.loading;
    }
    @Action(GetNearYouEstablishments)
    getNearYouEstablishments({
        getState,
        setState,
    }:StateContext<EstablishmentsNearYouStateModel>) {
        const state = getState();
        setState({
        ...state,
        loading: true,
        });
        return this.establishmentService.getAllEstablishmentsNearYou().pipe(
        tap((result) => {
            // console.log(result);
            //emporary array holds objects with position and sort-value
            const mapped = result.map((v, i) => {
            return { i, value: v.vendorOnline };
            });
            // map is like how we have result.length a built in method to use with arrays
            mapped.sort((a) => {
            if (!a.value) {
                return 1;
            }
            if (a.value) {
                return -1;
            }
            return 0;
            });

            const sortedItems = mapped.map((v) => result[v.i]);

            setState({
            ...state,
            establishmentsNearYou: result,
            loading: false,
            });
        })
        ); 
    }

  @Action(SetEstablishmentsNearYou)
    setEstablishmentsNearYou({ getState, setState }: StateContext<EstablishmentsNearYouStateModel>, { payload }: SetEstablishmentsNearYou) {
        const state = getState();
        setState({
            ...state,
            establishmentsNearYou: payload,
        });
    }
}

