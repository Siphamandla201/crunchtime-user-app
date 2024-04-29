export class OrderItemsModel {
  public id!: number;
  public quantity!: number;
  public pickUpTime!: number;
  public itemId!: number;
  public userId!: number;
  public amount!: number;
  public foodName!: string;
  public establishmentId!: number;
  public instructions: string = '';
  public orderStatus!: string;
  public addonForCartItem!: number;
  public pickupType: string = '';
  public addonGroupName: any;

}
