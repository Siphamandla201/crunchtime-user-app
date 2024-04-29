export class GetNearYouEstablishments{
    static readonly type = '[Establishment] GetNearYouEstablishments';
  }

  export class SetEstablishmentsNearYou {
    static readonly type = '[Establishment] SetEstablishmentsNearYou';
    constructor(public payload: any[]) {}
  }