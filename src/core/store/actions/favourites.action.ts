import {FavouritesRetrievalModel} from '../../models/favourites-retrieval.model';

export class AddFavourite {
    static readonly type = '[Favourite] Add';

    constructor(public id: number) {
    }
}

export class GetFavourites {
    static readonly type = '[Favourite] Get';
}

export class GetFavouriteEstablishments {
    static readonly type = '[Favourite] GetFavouriteEstablishments';
}

export class DeleteFavourite {
    static readonly type = '[Favourite] Delete';

    constructor(public id: number) {
    }
}

export class SetSelectedFavourite {
    static readonly type = '[Favourite] Set';

    constructor(public payload: FavouritesRetrievalModel) {
    }
}