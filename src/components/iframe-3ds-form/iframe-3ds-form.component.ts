import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-iframe-3ds-form',
  templateUrl: './iframe-3ds-form.component.html',
  styleUrls: ['./iframe-3ds-form.component.scss'],
})
export class IFrame3DSFormComponent {
  @Input()
  public url!: string;

  @Input()
  public parameters!: Array<Object>;

  @Input()
  public paramName!: string;

  @Input()
  public paramValue!: string;

  @Input()
  public successful!: boolean;

  @Input()
  public cardType!: string;

  @ViewChild('myForm')
  myForm!: ElementRef<HTMLFormElement>;

  redirURL!: SafeResourceUrl;
  form: any;

  constructor(
    private domSatizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private iab: InAppBrowser,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    console.log(this.url, this.parameters, this.successful, this.cardType);

    this.form = await this.formBuilder.group({ params: this.parameters });

    // await this.CompleteTransaction();

    let url = this.url;
    this.redirURL = this.domSatizer.bypassSecurityTrustResourceUrl(url);

    if (this.successful) {
      this.CompleteTransaction(this.form)
    }
  }

  public async CompleteTransaction(form: NgForm) {
    console.log(this.url)
    const url = this.url;
    // const parameters = { name: this.parameters[0]?.name, value: this.parameters[0]?.value };
    this.myForm.nativeElement.action = url;
    this.myForm.nativeElement.method = 'POST';
    const input = document.createElement('input');
    input.type = 'hidden';
    // input.name = parameters.name;
    // input.value = parameters.value;
    this.form = this.formBuilder.group({
      params: this.parameters,
    });
    console.log(this.myForm.nativeElement);
    if (this.form.valid) {
     console.log('FORM SUBMITTED');
     this.myForm.nativeElement.submit()
    } else {
      console.log('MOOO!');
    }
  }

  private submitForm() {
    const customScheme = 'https://crunchtimedelivery.app.link/';
    const browser = this.iab.create(
      this.url + `/?${this.paramName}=${this.paramValue}`,
      '_blank',
      {
        location: 'no',
        hidden: "no",
        hardwareback: 'yes',
        exitURL: customScheme
      }
    )

    browser.on('exit').subscribe(event => {
      if (event.url && !event.url.startsWith(this.url)) {
        // Handle the return to your app here
        // You can use a plugin like Deeplinks to route to specific pages within your app based on the URL.
        // For example, you can use Deeplinks.route(event.url) to navigate within your app.
        this.navCtrl.navigateForward("/checkout")
      }
    })
    // this.myForm.nativeElement.action = this.url;
    // this.myForm.nativeElement.method = 'POST';
    // const inputElement = document.createElement('input');
    // inputElement.type = 'hidden';
    // inputElement.name = this.paramName;
    // inputElement.value = this.paramValue;
    // this.myForm.nativeElement.appendChild(inputElement);
    // this.myForm.nativeElement.target = "_self"
    // this.myForm.nativeElement.submit();
  }
}
