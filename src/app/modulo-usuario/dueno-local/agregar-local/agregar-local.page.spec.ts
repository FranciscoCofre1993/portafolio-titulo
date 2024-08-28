import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarLocalPage } from './agregar-local.page';

describe('AgregarLocalPage', () => {
  let component: AgregarLocalPage;
  let fixture: ComponentFixture<AgregarLocalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarLocalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
