import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaLocalesPage } from './lista-locales.page';

const routes: Routes = [
  {
    path: '',
    component: ListaLocalesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaLocalesPageRoutingModule {}
