// export class GetEstablishmentMenuItems {
//     static readonly type = '[MenuItems] Get';

//     constructor(public id: number) {
//     }
// }

export class getFoodTypes {
    static readonly type = '[MenuItems] GetFoodTypes';
}

export class SetSelectedAddOns {
    static readonly type = '[MenuItems] SetAddOns';

    constructor(public id: number) {
    }
}

export class RemoveSelectedAddOns {
    static readonly type = '[MenuItems] RemoveAddOns';

    constructor(public id: number) {
    }
}

export class ClearSelectedAddOns {
    static readonly type = '[MenuItems] RemoveAddOns';
}