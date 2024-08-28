import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabsAdminPage } from './tabs-admin.page';

const routes: Routes = [
  {
    path: 'tabs-admin',
    component: TabsAdminPage,
    children: [
      {
        path: '',
        redirectTo: '/tabs-admin/changelog',
        pathMatch: 'full'
      },
      {
        path: 'changelog',
        loadChildren: () => import('../changelog/changelog.module').then(m => m.ChangelogPageModule)
      },
      {
        path: 'lista-usuarios',
        children: [
          {
            path: '',
            loadChildren: () => import('../Usuarios/lista-usuarios/lista-usuarios.module').then(m => m.ListaUsuariosPageModule)
          },
          {
            path: 'formulario',
            loadChildren: () => import('../Usuarios/formulario/formulario.module').then( m => m.FormularioPageModule)
          },
          {
            path: 'modificar',
            loadChildren: () => import('../Usuarios/modificar/modificar.module').then( m => m.ModificarPageModule)
          },
        ]
      },
      {
        path: 'lista-locales',
        children:[
          {
            path: '',
            loadChildren: () => import('../Locales/lista-locales/lista-locales.module').then(m => m.ListaLocalesPageModule)
          },
          {
            path: 'agregar-locales',
            loadChildren: () => import('../Locales/agregar-locales/agregar-locales.module').then( m => m.AgregarLocalesPageModule)
          },
          {
            path: 'modificar-locales',
            loadChildren: () => import('../Locales/modificar-locales/modificar-locales.module').then( m => m.ModificarLocalesPageModule)
          },
        ]
      },
      {
        path: 'lista-productos',
        children:[
          {
            path: '',
            loadChildren: () => import('../Productos/lista-productos/lista-productos.module').then( m => m.ListaProductosPageModule)
          },
          {
            path: 'agregar-productos',
            loadChildren: () => import('../Productos/agregar-productos/agregar-productos.module').then( m => m.AgregarProductosPageModule)
          },
          {
            path: 'modificar-producto',
            loadChildren: () => import('../Productos/modificar-producto/modificar-producto.module').then( m => m.ModificarProductoPageModule)
          },
        ]
      },
      {
        path: 'perfil',
        loadChildren: () => import('../perfil/perfil.module').then( m => m.PerfilPageModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsAdminPageRoutingModule {}
