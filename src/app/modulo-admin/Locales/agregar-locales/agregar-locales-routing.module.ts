import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarLocalesPage } from './agregar-locales.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarLocalesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarLocalesPageRoutingModule {}
