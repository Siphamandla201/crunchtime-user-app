import { Injectable } from '@angular/core';
import {State, Action, StateContext, Selector} from '@ngxs/store';
import {OrderItemsModel} from "../../models/order-items.model";
import {OrderService} from "../../services/order.service";
import { MenuItemsService } from 'src/core/services/menu-items.service';
import {tap} from 'rxjs/operators';
import { AddToCart, ClearCart, GetCartItems, GetProcessedCartItems, RemoveFromCart, SetCartItem } from '../actions/cart.action';
import { totalmem } from 'os';

export class CartStateModel {
    cartItems: OrderItemsModel[] = [];
    processedItems: OrderItemsModel[] = [];
    selectedCartItem: OrderItemsModel = new OrderItemsModel;
    totalPrice!: number;
    carQuantity!: number;
    subtotals: any[] = [];
}

@State<CartStateModel>({
    name: 'cartItems',
    defaults: {
        cartItems: [],
        processedItems: [],
        selectedCartItem: null!,
        totalPrice: 0,
        carQuantity: 0,
        subtotals: []
    }
})

@Injectable({
    providedIn: 'root'
})
export class CartState {

    constructor(private readonly _orderService: OrderService, private readonly _menuService: MenuItemsService) {
    }

    @Selector()
    static getCartItems(state: CartStateModel) {
        return state.cartItems;
    }

    @Selector()
    static getProcessedCartItems(state: CartStateModel) {
        return state.processedItems;
    }

    @Selector()
    static getTotalPrice(state: CartStateModel) {
        return state.totalPrice;
    }

    @Selector()
    static getSubtotals(state: CartStateModel) {
        return state.subtotals;
    }

    @Selector()
    static getCartQuantity(state: CartStateModel) {
        return state.carQuantity;
    }

    @Selector()
    static getSelectedCartItem(state: CartStateModel) {
        return state.selectedCartItem;
    }

    @Action(GetCartItems)
    getEstablishments({getState, setState}: StateContext<CartStateModel>) {
        const state = getState();
        return this._orderService.getSelectedItems().pipe(tap((result) => {
            let newTotalPrice = 0
            let newCartQuantity = 0
            let subtotalsPlaceholder: { forItem: number; total: number; }[] = []
            result.forEach(item => {
                newTotalPrice += item.amount
                if(item.addonForCartItem == 0){
                    newCartQuantity += parseInt(item.quantity.toString())
                }
            })

            result.forEach(item => {
              let append = true;
              if(subtotalsPlaceholder.length){
                subtotalsPlaceholder.forEach(total => {
                  if(total.forItem == item.id){
                    append = false
                  }
                })
              }
      
              if(append && item.addonForCartItem == 0){
                let total = item.amount
                result.forEach(addon => {
                  if(addon.addonForCartItem == item.id){
                    total += addon.amount
                  }
                })
      
                subtotalsPlaceholder.push({forItem: item.id, total})
              }
            })
            setState({
                ...state,
                cartItems: result,
                totalPrice: newTotalPrice,
                carQuantity: newCartQuantity,
                subtotals: subtotalsPlaceholder,
            });
        }));
    }

    @Action(GetProcessedCartItems)
    getProcessedItems({getState, setState}: StateContext<CartStateModel>, {id}: GetProcessedCartItems) {
        const state = getState();
        return this._orderService.getProcessedItems(id).pipe(tap((result) => {
            let newTotalPrice = 0
            let newCartQuantity = 0
            let subtotalsPlaceholder: { forItem: number; total: number; }[] = []
            result.forEach(item => {
                newTotalPrice += item.amount
                if(item.addonForCartItem == 0){
                    newCartQuantity += parseInt(item.quantity.toString())
                }
            })

            result.forEach(item => {
              let append = true;
              if(subtotalsPlaceholder.length){
                subtotalsPlaceholder.forEach(total => {
                  if(total.forItem == item.id){
                    append = false
                  }
                })
              }
      
              if(append && item.addonForCartItem == 0){
                let total = item.amount
                result.forEach(addon => {
                  if(addon.addonForCartItem == item.id){
                    total += addon.amount
                  }
                })
      
                subtotalsPlaceholder.push({forItem: item.id, total})
              }
            })
            setState({
                ...state,
                processedItems: result,
                totalPrice: newTotalPrice,
                carQuantity: newCartQuantity,
                subtotals: subtotalsPlaceholder,
            });
        }));
    }

    @Action(AddToCart)
    async addToCart({getState, patchState}: StateContext<CartStateModel>, {id, addonfor, increment}: AddToCart) {
        return (await this._menuService.addFoodItemToCart(id, addonfor, increment)).pipe(tap((result) => {
            const state = getState();
            let filteredArray = state.cartItems
            let append = true
            let newTotalPrice = 0
            let newCartQuantity = 0

            filteredArray.forEach((item, i) => {
                if(item.id == id && increment){
                    filteredArray[i].quantity = result.quantity
                    filteredArray[i].amount = result.amount
                    append = false
                }
                if(item.addonForCartItem == id){
                    filteredArray[i].amount = (filteredArray[i].amount/parseInt(filteredArray[i].quantity.toString()))*parseInt(result.quantity.toString())
                    filteredArray[i].quantity = result.quantity
                }
            })

            if(append){
                filteredArray = [...filteredArray, result]
            }
            
            filteredArray.forEach((item) => {
                newTotalPrice += item.amount
                if(item.addonForCartItem == 0){
                    newCartQuantity += parseInt(item.quantity.toString())
                }
            })
            
            let subtotalsPlaceholder: { forItem: number; total: number; }[] = []

            filteredArray.forEach(item => {
              let append = true;
              if(subtotalsPlaceholder.length){
                subtotalsPlaceholder.forEach(total => {
                  if(total.forItem == item.id){
                    append = false
                  }
                })
              }
      
              if(append && item.addonForCartItem == 0){
                let total = item.amount
                filteredArray.forEach(addon => {
                  if(addon.addonForCartItem == item.id){
                    total += addon.amount
                  }
                })
      
                subtotalsPlaceholder.push({forItem: item.id, total})
              }
            })

            patchState({
                cartItems: filteredArray,
                totalPrice: newTotalPrice,
                carQuantity: newCartQuantity,
                subtotals: subtotalsPlaceholder,
            });
        }));
    }

    @Action(ClearCart)
    async clearCart({getState, patchState}: StateContext<CartStateModel>) {
        return this._orderService.cancelOrder().then(() => {
            const state = getState();
            let newTotalPrice = 0
            patchState({
                cartItems: [],
                totalPrice: newTotalPrice,
                carQuantity: 0,
                subtotals: [],
            });
        });
    }


    @Action(RemoveFromCart)
async deleteFavourite({ getState, patchState }: StateContext<CartStateModel>, { id }: RemoveFromCart) {
    // Check if _menuService is defined
    if (!this._menuService) {
        return;
    }

    return (await this._menuService.removeFoodItemFromCart(id)).pipe(
        tap((result) => {
            const state = getState();
            if (!state) {
                return;
            }
            let filteredArray = state.cartItems;
            let filteredArrayBefore = state.cartItems;
            let append = true;
            let newTotalPrice = 0;
            let newCartQuantity = 0;

            if (filteredArray) {
                filteredArray.forEach((item, i) => {
                    if (parseFloat(item.quantity.toString()) >= 2 && item.id == id) {
                        filteredArray[i].quantity = result.quantity;
                        filteredArray[i].amount = result.amount;
                        append = false;
                    }
                    if (filteredArray) {
                        filteredArray.forEach((item2, a) => {
                            if (item2.addonForCartItem == filteredArray[i].id) {
                                filteredArray[a].amount = (filteredArray[a].amount / parseInt(filteredArray[a].quantity.toString())) * parseInt(result.quantity);
                                filteredArray[a].quantity = result.quantity;
                            }
                        });
                    }
                });
            }

            if (append && filteredArray) {
                let selectedOne = state.cartItems.filter(item => item.id == id);
                filteredArrayBefore = state.cartItems.filter(item => item.id !== id);
                filteredArray = filteredArrayBefore.filter(item => item.addonForCartItem !== selectedOne[0].id);
            }

            if (filteredArray) {
                filteredArray.forEach((item) => {
                    newTotalPrice += item.amount;
                    if (item.addonForCartItem == 0) {
                        newCartQuantity += parseInt(item.quantity.toString());
                    }
                });

                let subtotalsPlaceholder = [];

                subtotalsPlaceholder = state.subtotals.filter(total => total.forItem != id);

                filteredArray.forEach(item => {
                    if (item.addonForCartItem == 0 && item.id == id) {
                        let total = item.amount;
                        filteredArray.forEach(addon => {
                            if (addon.addonForCartItem == item.id) {
                                total += addon.amount;
                            }
                        });

                        subtotalsPlaceholder.push({ forItem: item.id, total });
                    }
                });

                patchState({
                    cartItems: filteredArray,
                    totalPrice: newTotalPrice,
                    carQuantity: newCartQuantity,
                    subtotals: subtotalsPlaceholder,
                });
            }
        })
    );
}

  

    @Action(SetCartItem)
    setSelectedTodoId({getState, setState}: StateContext<CartStateModel>, {payload}: SetCartItem) {
        const state = getState();
        setState({
            ...state,
            selectedCartItem: payload
        });
    }  
}