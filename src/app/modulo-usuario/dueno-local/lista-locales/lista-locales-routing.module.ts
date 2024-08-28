import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaLocalPage } from './lista-locales.page';

const routes: Routes = [
  {
    path: '',
    component: ListaLocalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaLocalPageRoutingModule {}
