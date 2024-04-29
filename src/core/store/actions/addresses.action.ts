import {Addresses} from "../../models/addresses.model";

export class AddAddress {
    static readonly type = '[Address] Add';

    constructor(public model: Addresses) {
    }
}

export class GetAddresses {
    static readonly type = '[Addresses] Get';
}

export class RemoveAddress{
    static readonly type = '[Address] Delete';

    constructor(public id: number) {
    }
}

export class SetAddress {
    static readonly type = '[Address] Set';

    constructor(public payload: Addresses) {
    }
}