import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; // Import IonicModule

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
})
export class ConversationComponent implements OnInit {
  public form!: FormGroup;
  newMessage: string = '';
  public conversationProxy: {
    [x: string]: any; getMessages: () => Promise<any>, on: (event: string, callback: (message: any) => void) => void 
} = {
    getMessages: function (): Promise<any> {
      throw new Error('Function not implemented.');
    },
    on: function (event: string, callback: (message: any) => void): void {
      throw new Error('Function not implemented.');
    }
  };

  @Input() public myIdentity: any;

  public messages: any[] = [];
  public loadingState = 'initializing';
  public boundConversations = new Set();
  sendMessageToServer: any;
state: any;
styles: any;

  constructor(private readonly _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initializeFormBuilder()
    console.log('whats going on here', this.conversationProxy);
    
    if (this.conversationProxy && typeof this.conversationProxy.getMessages === 'function') {
      this.loadMessagesFor(this.conversationProxy);

      if (!this.boundConversations.has(this.conversationProxy)) {
          let newConversation = this.conversationProxy;
          newConversation.on('messageAdded', (m: any) => this.messageAdded(m, newConversation));
          this.boundConversations = new Set([...this.boundConversations, newConversation])
      }
    }
  }

  public initializeFormBuilder() {
    this.form = this._formBuilder.group({
      message: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
        ],
      ]
    });
  }

  async ionViewDidEnter() {
    this.loadMessagesFor(this.conversationProxy);

    if (!this.boundConversations.has(this.conversationProxy)) {
      let newConversation = this.conversationProxy;
      newConversation.on('messageAdded', (m: any) => this.messageAdded(m, newConversation));
      this.boundConversations = new Set([...this.boundConversations, newConversation])
    }
  }

  loadMessagesFor(thisConversation: { getMessages: () => Promise<any> }) {
    if (this.conversationProxy === thisConversation) {
      thisConversation.getMessages()
        .then((messagePaginator: { items: any[] }) => {
          if (this.conversationProxy === thisConversation) {
            this.messages = messagePaginator.items;
            console.log('these are supposed to be the messages', messagePaginator.items);
            this.loadingState = 'ready';
          }
        })
        .catch((err: any) => {
          console.error("Couldn't fetch messages IMPLEMENT RETRY", err);
          this.loadingState = 'failed';
        });
    }
  }

  messageAdded(message: any, targetConversation: any) {
    if (targetConversation === this.conversationProxy) {
      this.messages = [...this.messages, message];
    }
  }

  onMessageChanged(event: { target: { value: string; }; }) {
    this.newMessage = event.target.value;
  }

  sendMessage(event: SubmitEvent) {
    // Prevent the default form submission behavior
    event.preventDefault();
  
    // Extract the message from the form control
    const message = this.form.get('message')?.value;
  
    // Reset the form control
    this.form.get('message')?.reset();
  
    // Call the appropriate method to send the message
    this.sendMessageToServer(message);
  }
  
}
