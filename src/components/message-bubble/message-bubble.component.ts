import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-message-bubble',
  templateUrl: './message-bubble.component.html',
  styleUrls: ['./message-bubble.component.scss'],
})
export class MessageBubbleComponent implements OnInit {

  @Input()
  direction: any
  @Input()
  message!: {
body: any;
state: any; getParticipant: () => any; sid: string; 
};
  @Input()
  key: any

  public type: any;

  constructor() { }

  async ngOnInit() {
    console.log('this is the direction', this.direction);
    this.type = (await this.message.getParticipant()).type;
    
    // Perform a null check before accessing document.getElementById
    const element = document.getElementById(this.message.sid);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      console.error(`Element with id '${this.message.sid}' not found.`);
    }
  }
  

}
