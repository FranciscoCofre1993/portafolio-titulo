import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaLocalesPage } from './lista-locales.page';

describe('ListaLocalesPage', () => {
  let component: ListaLocalesPage;
  let fixture: ComponentFixture<ListaLocalesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaLocalesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
