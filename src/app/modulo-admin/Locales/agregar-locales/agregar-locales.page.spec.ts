import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarLocalesPage } from './agregar-locales.page';

describe('AgregarLocalesPage', () => {
  let component: AgregarLocalesPage;
  let fixture: ComponentFixture<AgregarLocalesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarLocalesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
