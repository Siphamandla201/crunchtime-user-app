import { Component, Input, OnInit } from '@angular/core';
import { MessageBubbleComponent } from '../message-bubble/message-bubble.component';
import { IonicModule } from '@ionic/angular'; // Import IonicModule

@Component({
  selector: 'app-conversations-messages',
  templateUrl: './conversations-messages.component.html',
  styleUrls: ['./conversations-messages.component.scss'],
})
export class ConversationsMessagesComponent implements OnInit {

  @Input()
  public messages: any
  @Input()
  public myIdentity: any

  constructor() { }

  ngOnInit() {}

}
