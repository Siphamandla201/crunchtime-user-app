export class PeachPaymentResponseModel {
    public id!: string;
    public paymentBrand!: string;
    public result!: Object;
    public card!: Object;
    public redirect!: {
        url: string;
        parameters: Array<any>;
        preconditions: {
            origin: string;
            waitUntil: string;
            description: string;
            url: string;
            method: string;
            parameters: [
                {
                    name: string;
                    value: string;
                }
            ];
        };
    };
    public buildNumber!: string;
    public timestamp!: string;
    public ndc!: string;
}