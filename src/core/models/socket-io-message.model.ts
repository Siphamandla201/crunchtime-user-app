import { DeliveryRetrievalModel } from "./delivery-retrieval.model";

export class SocketIoMessageModel {
    public room: string = '';
    public type: string = '';
    public message: string = '';
  }