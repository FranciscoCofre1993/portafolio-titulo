import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConfDeleteLocalDialogComponent } from './conf-delete-local-dialog.component';

describe('ConfDeleteLocalDialogComponent', () => {
  let component: ConfDeleteLocalDialogComponent;
  let fixture: ComponentFixture<ConfDeleteLocalDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfDeleteLocalDialogComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfDeleteLocalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
