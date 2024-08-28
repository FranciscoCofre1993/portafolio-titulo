import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarLocalesPage } from './modificar-locales.page';

describe('ModificarLocalesPage', () => {
  let component: ModificarLocalesPage;
  let fixture: ComponentFixture<ModificarLocalesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarLocalesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
