import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';
import { SocketIoMessageModel } from '../models/socket-io-message.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {
  private readonly socketUrl: string = environment.socketServer;
  private socket: any;

  constructor() {
    this.socket = io(this.socketUrl);
  }

  sendMessageToUser(message: SocketIoMessageModel, room: string): void {
    this.socket.emit('messageSendToUser', message, room);
  }

  // Listen for incoming events
  onMessageReceived(room: string, deliveryId: string): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('orderStatusChanged', (data: any) => {
        observer.next(data);
      });
    });
  }

  onItemsUpdated(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('menuItemsUpdated', (data: any) => {
        observer.next(data);
      });
    });
  }
}
