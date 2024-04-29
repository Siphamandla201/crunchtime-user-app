import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FormControlErrorComponent } from './form-control-error.component';

describe('FormControlErrorComponent', () => {
    let component: FormControlErrorComponent;
    let fixture: ComponentFixture<FormControlErrorComponent>;

    beforeEach(async(async () => {
        await TestBed.configureTestingModule({
            declarations: [FormControlErrorComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(FormControlErrorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', async () => {
        expect(component).toBeTruthy();
    });
});
