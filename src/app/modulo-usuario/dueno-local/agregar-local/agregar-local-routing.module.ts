import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarLocalPage } from './agregar-local.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarLocalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarLocalPageRoutingModule {}
