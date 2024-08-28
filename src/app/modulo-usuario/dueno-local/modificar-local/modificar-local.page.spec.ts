import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarLocalPage } from './modificar-local.page';

describe('ModificarLocalPage', () => {
  let component: ModificarLocalPage;
  let fixture: ComponentFixture<ModificarLocalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarLocalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
