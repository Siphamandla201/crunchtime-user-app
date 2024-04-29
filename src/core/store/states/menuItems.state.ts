import { Inject, Injectable } from '@angular/core';
import {State, Action, StateContext, Selector} from '@ngxs/store';
import {CategoryRetrievalModel} from '../../models/category-retrieval.model';
import {IMenuItemsModel} from '../../models/menu-items.model';
import {SetSelectedAddOns, RemoveSelectedAddOns, ClearSelectedAddOns, getFoodTypes} from '../actions/menuItems.action';
import {CategoryResourceService} from '../../services/category-resource.service';
import {tap} from 'rxjs/operators';
import { MenuItemsService } from 'src/core/services/menu-items.service';
import { FoodTypesService } from 'src/core/services/food-types.service';
import { FoodTypesRetrievalModel } from 'src/core/models/food-types-retrieval.model';

export class MenuItemsStateModel {
    categories: CategoryRetrievalModel[] = [];
    menuItems: any[] = [];
    selectedCategory: any;
    foodTypes: FoodTypesRetrievalModel[] = [];
    selectedMenuItem: IMenuItemsModel = new IMenuItemsModel;
    selectedAddOns: IMenuItemsModel[] = [];
    loading: boolean = false;
}

@State<MenuItemsStateModel>({
    name: 'menuItems',
    defaults: {
        categories: [],
        menuItems: [],
        selectedCategory: null,
        selectedMenuItem: null!,
        foodTypes: [],
        selectedAddOns: [],
        loading: false
    }
})

@Injectable({
    providedIn: 'root'
})
export class MenuItemsState {

    constructor(@Inject(FoodTypesService) private foodTypeService: FoodTypesService) {
    }
    

    @Selector()
    static getCategories(state: MenuItemsStateModel) {
        return state.categories;
    }

    @Selector()
    static getFoodTypes(state: MenuItemsStateModel) {
        return state.foodTypes;
    }

    @Selector()
    static getCategoryMenuItems(state: MenuItemsStateModel) {
        return state.menuItems;
    }

    @Selector()
    static getSelectedMenuItem(state: MenuItemsStateModel) {
        return state.selectedMenuItem;
    }

    @Selector()
    static getSelectedAddOns(state: MenuItemsStateModel) {
        return state.selectedAddOns;
    }
    
    @Selector()
    static getSelectedCategory(state: MenuItemsStateModel) {
        return state.selectedCategory;
    }

    @Selector()
    static getLoading(state: MenuItemsStateModel) {
        return state.loading;
    }

    @Action(getFoodTypes)
    getFoodTypes({getState, setState}: StateContext<MenuItemsStateModel>) {
        const state = getState();
        setState({
            ...state,
            loading:true
        })
        return this.foodTypeService.getFoodTypes().pipe(tap((result) => {
            setState({
                ...state,
                foodTypes: result,
                loading: false
            });
        }));
    }

    // @Action(GetEstablishmentCategories)
    // get({getState, patchState}: StateContext<MenuItemsStateModel>, {id}: GetEstablishmentCategories) {
    //     return this.categoryService.getAllCategoriesNew(id).pipe(tap((result) => {
    //         const state = getState();

    //         const establishment = state.categories.filter(category => category.establishmentId == result[0].establishmentId)

    //         if(!establishment.length){
    //             patchState({
    //                 categories: [...state.categories, ...result],
    //             });
    //         }
    //     }));
    // }

    // @Action(GetEstablishmentMenuItems)
    // getMenu({setState, getState}: StateContext<MenuItemsStateModel>, {id}: GetEstablishmentMenuItems) {
    //     return this.menuService.getAllMenuItems(id).pipe(tap((result) => {
    //         const state = getState();

    //         let newMenuItems = []

    //         const establishment = state.menuItems.filter(item => item.establishmentId == id);

    //         if(!establishment.length){
    //             state.categories.forEach( category => {
    //                 if(category.establishmentId == id){

    //                     let data = result.filter(menuItem => menuItem.categoryId == category.id)
        
    //                     newMenuItems.push({categoryId: category.id, categoryName: category.categoryName, establishmentId: category.establishmentId, data})
    //                 }
    //             })
                
    //             setState({
    //                 ...state,
    //                 menuItems: [...state.menuItems, ...newMenuItems],
    //             });
    //         }


            
    //         // if(category){
    //         //     let notNewOne = state.menuItems.filter(item => item.categoryId == categoryMenuItems.categoryId)

    //         //     // let newOne = state.menuItems.filter(item => item.categoryId != categoryMenuItems.categoryId)
    //         //     if(!notNewOne.length){
    //         //         newMenuItems = [...state.menuItems, categoryMenuItems]
    
    //         //         // temporary array holds objects with position and sort-value
    //         //         const mapped = newMenuItems.map((v, i) => {
    //         //         return { i, value: v.categoryId };
    //         //         });
    
    //         //         // sorting the mapped array containing the reduced values
    //         //         mapped.sort((a, b) => {
    //         //         if (a.value > b.value) {
    //         //             return 1;
    //         //         }
    //         //         if (a.value < b.value) {
    //         //             return -1;
    //         //         }
    //         //         return 0;
    //         //         });
    
    //         //         const sortedItems = mapped.map((v) => newMenuItems[v.i]);
                    
    //         //         patchState({
    //         //             menuItems: sortedItems,
    //         //         });
    //         //     }
                
    //         // }
            
    //     }));
    // }

    // @Action(SetSelectedAddOns)
    // setSelectedAddOns({getState, setState}: StateContext<any>, {id}: SetSelectedMenuItem) {
    //     const state = getState();

    //     let existingAddons = state.selectedAddOns

    //     let menuItem = state.selectedCategory.data.filter(item => item.id == id)[0]
    //     let append = true

    //     existingAddons.forEach(addon => {
    //         if(addon.id == menuItem.id){
    //             append = false
    //         }
    //     })

    //     if(append){
    //         existingAddons = state.selectedAddOns.filter(item => item.id != menuItem.id && item.addonGroup != menuItem.addonGroup)
    //         existingAddons.push(menuItem)
    //     }

    //     setState({
    //         ...state,
    //         selectedAddOns: existingAddons
    //     });
    // } 

    // @Action(RemoveSelectedAddOns)
    // RemoveSelectedAddOns({getState, setState}: StateContext<any>, {id}: SetSelectedMenuItem) {
    //     const state = getState();

    //     let existingAddons = state.selectedAddOns

    //     setState({
    //         ...state,
    //         selectedAddOns: existingAddons.filter(addon => addon.id != id)
    //     });
    // }

    @Action(ClearSelectedAddOns)
    clearSelectedAddOns({getState, setState}: StateContext<any>) {
        const state = getState();
        
        setState({
            ...state,
            selectedAddOns: []
        });
    }  
}