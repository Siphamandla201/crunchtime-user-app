import { EstablishmentService } from 'src/core/services/establishment.service';
import { Action, Selector, State, StateContext } from '@ngxs/store';
// import { EstablishmentService } from '../../services/establishment.service';
import { IEstablishmentRetrievalModel } from '../../models/establishment-retrieval.model';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import {
  GetEstablishmentCategories,
  GetEstablishmentMenuItems,
  GetEstablishments,
  SetSelectedEstablishment,
  SetSelectedMenuItem,
} from '../actions/establishments.action';
import { CategoryResourceService } from 'src/core/services/category-resource.service' ;
import { MenuItemsService } from 'src/core/services/menu-items.service';
import { CategoryRetrievalModel } from 'src/core/models/category-retrieval.model';
import { IMenuItemsModel } from 'src/core/models/menu-items.model';


export class EstablishmentStateModel {
  establishments: any[] = [];
  selectedEstablishment: any;
  selectedCategory: CategoryRetrievalModel = new CategoryRetrievalModel;
  selectedMenuItem: any;
  establishmentCategories: CategoryRetrievalModel[] = [];
  loading: boolean = false;
}

@State<EstablishmentStateModel>({
  name: 'establishments',
  defaults: {
    establishments: [],
    establishmentCategories: [],
    selectedEstablishment: null,
    selectedCategory: null!,
    selectedMenuItem: null,
    loading: false,
  },
})
@Injectable({
  providedIn: 'root',
})
export class EstablishmentState {
  constructor(private establishmentService: EstablishmentService, private categoryService: CategoryResourceService, private menuService: MenuItemsService) {}

  @Selector()
  static getEstablishments(state: EstablishmentStateModel) {
    return state.establishments;
  }
  
  @Selector()
  static getEstablishmentCategories(state: EstablishmentStateModel) {
    return state.establishmentCategories;
  }

  @Selector()
  static getSelectedEstablishment(state: EstablishmentStateModel) {
    return state.selectedEstablishment;
  }

  @Selector()
  static getSelectedMenuItem(state: EstablishmentStateModel) {
    return state.selectedMenuItem;
  }

  @Selector()
  static getSelectedCategory(state: EstablishmentStateModel) {
    return state.selectedCategory;
  }

  @Selector()
  static getLoading(state: EstablishmentStateModel) {
    return state.loading;
  }

  @Action(GetEstablishments)
  getEstablishments({
    getState,
    setState,
  }: StateContext<EstablishmentStateModel>) {
    const state = getState();
    setState({
      ...state,
      loading: true,
    });
    return this.establishmentService.getAllEstablishments().pipe(
      tap((result) => {
        //console.log(result);
        //emporary array holds objects with position and sort-value
        // console.log(result)
        const mapped = result.map((v, i) => {
          return { i, value: v.vendorOnline };
        });
        // console.log(mapped)
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
        // console.log(mapped)

        setState({
          ...state,
          establishments: result,
          loading: false,
        });
      })
    );
  }

  

  // @Action(GetEstablishments)
  // patchEstablishments({patchState}: StateContext<EstablishmentStateModel>) {
  //     return this.establishmentService.getAllEstablishmentsNearYou().subscribe((result) => {
  //         patchState({
  //             establishments: result,
  //         });
  //     });
  // }

    @Action(GetEstablishmentCategories)
    get({getState, patchState}: StateContext<EstablishmentStateModel>, {id}: GetEstablishmentCategories) {
        return this.categoryService.getAllCategoriesNew(id).pipe(tap((result) => {
            const state = getState();

            console.log(result)

            const establishment = state.establishmentCategories.filter(category => category.establishmentId == result[0]?.establishmentId)
            console.log(establishment)

            if(!establishment.length){  
                patchState({
                  establishmentCategories: [...state.establishmentCategories, ...result],
                });
            }
        }));
    }

    @Action(GetEstablishmentMenuItems)
getMenu({ setState, getState }: StateContext<EstablishmentStateModel>, { id }: GetEstablishmentMenuItems) {
  return this.menuService.getAllMenuItems(id).pipe(
    tap((result) => {
      const state = getState();
      let newMenuItems: { categoryId: number; categoryName: string; establishmentId: number; data: any[]; }[] = [];
      let modifiedEst = state.establishments;

      modifiedEst.forEach((establishment, i) => {
        if (establishment.id == id) {
          state.establishmentCategories.forEach((category) => {
            if (category.establishmentId == id) {
              let data = result.filter((menuItem) => menuItem.categoryId == category.id);
              let newData: IMenuItemsModel[] = [];
              data.forEach((menuData) => {
                if (!menuData.addon) {
                  let allAddons = data.filter((addon) => addon.addonForItem === menuData.id);
                  let addonArray: IMenuItemsModel[] = [];
                  let groupAddons: { addonName: string; groupItems: IMenuItemsModel[]; }[] = [];
                  allAddons.forEach((item) => {
                    if (item.addonGroup != 'none') {
                      let append = true;
                      if (groupAddons.length) {
                        groupAddons.forEach((group) => {
                          if (group.addonName == item.addonGroup) {
                            append = false;
                          }
                        });
                      }
                      if (append) {
                        let groupItems = allAddons.filter((stuff) => stuff.addonGroup == item.addonGroup);
                        const mapped = groupItems.map((v, i) => {
                          return { i, value: v.foodPrice };
                        });
                        mapped.sort((a, b) => {
                          if (a.value > b.value) {
                            return 1;
                          }
                          if (a.value < b.value) {
                            return -1;
                          }
                          return 0;
                        });
                        const result = mapped.map((v) => groupItems[v.i]);
                        groupAddons.push({ addonName: item.addonGroup, groupItems: result });
                      }
                    }
                    if (item.addonGroup == 'none') {
                      if (addonArray.length) {
                        let addon = addonArray.filter((addon) => addon.id == item.id);
                        if (!addon.length) {
                          addonArray.push(item);
                        }
                      } else {
                        addonArray.push(item);
                      }
                    }
                  });
                  if (addonArray.length > 0 || groupAddons.length > 0) {
                    // Set addon to true if there are any addons available
                    newData.push({ ...menuData, addon: true, addonArray: addonArray, groupAddons: groupAddons });
                  } else {
                    // Set addon to false if there are no addons available
                    newData.push({ ...menuData, addon: false, addonArray: [], groupAddons: [] });
                  }
                } else {
                  newData.push(menuData);
                }
              });

              newMenuItems.push({ categoryId: category.id, categoryName: category.categoryName, establishmentId: category.establishmentId, data: newData });
            }
          });

          modifiedEst[i] = { ...establishment, menuItems: newMenuItems };
        }
      });

      setState({
        ...state,
        establishments: modifiedEst,
      });
    })
  );
}

  
    @Action(SetSelectedMenuItem)
    setSelectedMenuItem({getState, setState}: StateContext<EstablishmentStateModel>, {id, categoryId}: SetSelectedMenuItem) {
        const state = getState();

        let category = state.selectedEstablishment.menuItems.filter((item: { categoryId: number; }) => item.categoryId == categoryId)[0]

        console.log(category)

        let menuItem = category.data.filter((item: { id: number; }) => item.id == id)[0]
        console.log(menuItem)

        setState({
            ...state,
            selectedCategory: category,
            selectedMenuItem: menuItem
        });
    }  

    @Action(SetSelectedEstablishment)
    setSelectedEstablishmentId(
      { getState, setState }: StateContext<EstablishmentStateModel>,
      { id }: SetSelectedEstablishment
    ) {
      const state = getState();
      let selected: IEstablishmentRetrievalModel | undefined = undefined;
    
      state.establishments.forEach((es) => {
        if (es.id == id) {
          selected = es;
        }
      });
    
      setState({
        ...state,
        selectedEstablishment: selected,
      });
    }
    

  
}
