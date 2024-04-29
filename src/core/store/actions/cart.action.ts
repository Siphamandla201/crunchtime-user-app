import {OrderItemsModel} from "../../models/order-items.model";

export class AddToCart {
    static readonly type = '[CartItem] Add';

    constructor(public id: any, public addonfor: number, public increment: boolean) {
    }
}

export class GetCartItems {
    static readonly type = '[CartItem] Get';
}

export class GetProcessedCartItems {
    static readonly type = '[CartItem] Get Processed';

    constructor(public id: number) {
    }
}

export class RemoveFromCart{
    static readonly type = '[CartItem] Delete';

    constructor(public id: number) {
    }
}
export class ClearCart{
    static readonly type = '[CartItems] Clear';
}

export class SetCartItem {
    static readonly type = '[CartItem] Set';

    constructor(public payload: OrderItemsModel) {
    }
}