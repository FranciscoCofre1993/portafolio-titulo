import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modulo-usuario/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./modulo-admin/tabs-admin/tabs-admin.module').then( m => m.TabsAdminPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./modulo-login/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./modulo-login/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'detalle-local',
    loadChildren: () => import('./modulo-usuario/detalle-local/detalle-local.module').then( m => m.DetalleLocalPageModule)
  },
 


  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
