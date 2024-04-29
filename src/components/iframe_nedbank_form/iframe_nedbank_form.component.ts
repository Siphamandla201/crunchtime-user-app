import { Component, ElementRef, Input, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Component({
  selector: 'app-iframe_nedbank_form',
  templateUrl: './iframe_nedbank_form.component.html',
  styleUrls: ['./iframe_nedbank_form.component.scss'],
})
export class IFrameNedbankFormComponent {
  @Input()
  public url!: string;

  @Input()
  public parameters: Array<Object> = [];

  @Input()
  public paramName!: string;

  @Input()
  public paramValue!: string;

  @Input()
  public successful: boolean = false;

  @Input()
  public cardType!: string;

  redirURL!: SafeResourceUrl;
  public form!: FormGroup;

  @ViewChild('myForm1')
  myForm1!: ElementRef<HTMLFormElement>;

  constructor(
    private domSatizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private iab: InAppBrowser
  ) {}

  async ngOnInit() {

    this.form = await this.formBuilder.group({
      paramName: [this.paramName],
      paramValue: [this.paramValue],
    });

    let url = this.url;
    this.redirURL = this.domSatizer.bypassSecurityTrustResourceUrl(url);
    console.log(this.url, this.paramName, this.paramValue)

    if (this.successful) {
      this.submitForm()
    }
  }

  public ngAfterViewInit() {
    if (this.successful) {
      this.submitForm()
    }
  }

  public CompleteTransaction() {
    console.log(this.url)
    const url = this.url;
    this.myForm1.nativeElement.action = url;
    this.myForm1.nativeElement.method = 'POST';
    const input = document.createElement('input');

    input.type = 'hidden';
    this.form = this.formBuilder.group({
      params: [this.parameters],
    });
    console.log(this.form);
    if (this.form.valid) {
      console.log('FORM SUBMITTED');
      this.myForm1.nativeElement.submit()
      return this.form.value;
    } else {
      console.log('MOOO!');
    }
  }

  private submitForm() {
    const customScheme = 'https://crunchtimedelivery.app.link';
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
      }
    })

  }
}
