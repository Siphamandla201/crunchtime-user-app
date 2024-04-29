// categories.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CategoryRetrievalModel } from '../../core/models/category-retrieval.model';
import { CategoryResourceService } from '../../core/services/category-resource.service';
import { Router } from '@angular/router';
import { DriverDetailsRetrievalModel } from 'src/core/models/driver-details-retrieval.model';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  @Input() public id!: number;
  @Input() public establishmentName!: string;
  @Input() public establishmentLogo!: string;
  @Input() public driversOnline!: DriverDetailsRetrievalModel[];

  public categories!: CategoryRetrievalModel[];

  constructor(
    private readonly _categoryResourceService: CategoryResourceService,
    private readonly _router: Router
  ) {}

  async ngOnInit() {
    this.categories = await this._categoryResourceService.getAllCategories(this.id);
  }

  public async seeMenuItems(id: number, categoryName: string): Promise<void> {
    localStorage.setItem('establishmentName', this.establishmentName);
    localStorage.setItem('establishmentId', String(this.id));
    localStorage.setItem('establishmentLogo', this.establishmentLogo);
    localStorage.setItem('categoryName', categoryName);
    localStorage.setItem('categoryId', String(id));
    await this._router.navigate(['/menu-items-list']);
  }
}
