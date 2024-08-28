import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificarLocalesPage } from './modificar-locales.page';

const routes: Routes = [
  {
    path: '',
    component: ModificarLocalesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificarLocalesPageRoutingModule {}
