export class GetPromos {
    static readonly type = '[Promos] Get'
}

export class GetPromosEstablishments {
    static readonly type = '[Promos] GetPromosEstablishments'
}

export class SetSelectedPromos {
    static readonly type = '[Promos] Set'

    constructor(public id: number) {}
}