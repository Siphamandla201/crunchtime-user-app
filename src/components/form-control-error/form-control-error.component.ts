import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-control-error',
  templateUrl: './form-control-error.component.html',
  styleUrls: ['./form-control-error.component.scss'],
})
export class FormControlErrorComponent {
[x: string]: any;
  @Input()
  public control!: AbstractControl;
  @Input()
  public label!: string;
  @Input()
  public submitting!: boolean;

  public message!: string;

  constructor() {}
  public ngOnInit() {
    this.message = `The ${this.label} is required`;
    if (this.label === 'accountNumber') {
      this.message = 'Please fill in your card number details.';
    }

    
  }
}
