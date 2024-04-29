export class OrderHistoryRetrievalModel {
  public id!: number;
  public driverId!: number;
  public amount!: number;
  public lastModifiedDate: string = '';
  public deliveryStatus: string = '';
  public establishmentName: string = '';
}
