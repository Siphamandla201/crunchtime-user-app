export class IMenuItemsModel {
  public id!: number;
  public foodName!: string;
  public foodPrice!: number;
  public foodType!: string;
  public establishmentId!: number;
  public description!: string;
  public addon: boolean = false;
  public addonRequired!: boolean;
  public addonGroup!: string;
  public addonForItem!: number;
  public addonForCategory!: number;
  public categoryId!: number;
  addonArray?: IMenuItemsModel[];
  groupAddons?: { addonName: string; groupItems: IMenuItemsModel[] }[]; // Ensure addonName is string
}
