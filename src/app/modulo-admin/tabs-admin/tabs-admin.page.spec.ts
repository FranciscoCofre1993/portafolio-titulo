import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsAdminPage } from './tabs-admin.page';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('TabsAdminPage', () => {
  let component: TabsAdminPage;
  let fixture: ComponentFixture<TabsAdminPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabsAdminPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
