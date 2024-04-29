import { IEstablishmentRetrievalModel } from '../../models/establishment-retrieval.model';

export class GetEstablishments {
  static readonly type = '[Establishment] Get';
}


export class SetSelectedEstablishment {
  static readonly type = '[Establishment] Set';

  constructor(public id: number) {}
}


export class GetEstablishmentMenuItems {
  static readonly type = '[MenuItems] Get';

  constructor(public id: number) {
  }
}

export class GetEstablishmentCategories {
  static readonly type = '[Categories] GetEstablishmentCategories';

  constructor(public id: number) {
  }
}

export class SetSelectedMenuItem {
    static readonly type = '[MenuItems] SetItem';

    constructor(public id: number, public categoryId: number) {
    }
}
