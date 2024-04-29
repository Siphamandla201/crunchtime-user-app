export class DeliveryRetrievalModel {
  public id!: number;
  public deliveryStatus!: string;
  public orderStatus!: string;
  public establishmentName: string = '';
  public userLatitude!: string;
  public userLongitude!: string;
  public establishmentLatitude!: string;
  public establishmentLocation!: string;
  public establishmentLongitude!: string;
  public orderPin!: string;
  public orderNumber!: string;
  public establishmentId!: string;

}
// private String driverId;
// private float amount;
// private Instant lastModifiedDate;
// private String deliveryStatus;
// private String orderStatus;
// private String establishmentName;
// private String userLocation;
// private String userLatitude;
// private String userLongitude;
// private String establishmentLocation;
// private String establishmentLatitude;
// private String establishmentLongitude;
// private float driverPaymentAmount;
// private String orderNumber;
