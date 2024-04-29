import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BankingRetrievalModel } from 'src/core/models/banking-details-retrieval.model';
import { BankingDetailsResourceService } from 'src/core/services/banking-details-resource.service';

@Component({
  selector: 'app-show-banking-detail',
  templateUrl: './show-banking-detail.component.html',
  styleUrls: ['./show-banking-detail.component.scss'],
})
export class ShowBankingDetailComponent implements OnInit {
  public bankingDetails: Array<BankingRetrievalModel> = [];

  constructor(
    public element: ElementRef, 
    public renderer: Renderer2,
    public modalController: ModalController,
    public bankingService: BankingDetailsResourceService,
    public _router: Router
    ) {
     }

  async ngOnInit() {
    this.bankingDetails = await this.bankingService.getAllBankingDetails();
  }

  public async setSelectedBankingDetails(id: number) {
    await this.bankingService.setSelectedBankingDetails(id).then(async () => {
      await this.modalController.dismiss()
    }).catch(err => {
      console.log(err)
    })
    
  }

  public async closeModal() {
    await this.modalController.dismiss()
  }

  public async addABankCard() {
    await this.modalController.dismiss()
    await this._router.navigate(['/payment-options']);
  }

 
}
