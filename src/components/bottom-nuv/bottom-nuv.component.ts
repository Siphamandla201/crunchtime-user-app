import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import {Router,  NavigationEnd } from "@angular/router";
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-bottom-nuv',
  templateUrl: './bottom-nuv.component.html',
  styleUrls: ['./bottom-nuv.component.scss'],
})

export class BottomNuvComponent implements OnInit {
  @ViewChild("NavContainer") NavContainer: HTMLElement | undefined;
  public isActive: boolean = false;
  
  constructor(
    private readonly _router: Router,
    public element: ElementRef, 
    public renderer: Renderer2,
  ) {
    this._router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        console.log('route change');
        let nav = document.querySelector('#navbar') as HTMLElement | null;

       if (nav) {
        if (this._router.url === '/home' || this._router.url === '/user-profile' || this._router.url === '/my-orders' || this._router.url === '/donate') {
            nav.style.display = 'block';
        } else {
            nav.style.display = 'none';
        }
    }
      }
    });
   }

  ngOnInit() {
  }

  public async goToHome() {
    await this._router.navigate(['/home']);
  }
  
  public async goToOrders() {
    await this._router.navigate(['/my-orders']);
    
  }

  public async goToAccount() {
    await this._router.navigate(['/user-profile']);
    
  }

  public async goToDonate() {
    await this._router.navigate(['/donate']);
    
  }

}


