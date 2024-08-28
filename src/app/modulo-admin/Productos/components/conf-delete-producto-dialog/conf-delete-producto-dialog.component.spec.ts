import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConfDeleteProductoDialogComponent } from './conf-delete-producto-dialog.component';

describe('ConfDeleteProductoDialogComponent', () => {
  let component: ConfDeleteProductoDialogComponent;
  let fixture: ComponentFixture<ConfDeleteProductoDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfDeleteProductoDialogComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfDeleteProductoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
