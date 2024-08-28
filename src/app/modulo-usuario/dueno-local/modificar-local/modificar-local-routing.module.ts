import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificarLocalPage } from './modificar-local.page';

const routes: Routes = [
  {
    path: '',
    component: ModificarLocalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificarLocalPageRoutingModule {}
