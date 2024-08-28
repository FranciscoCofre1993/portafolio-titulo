import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../Mapa/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../Inicio/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('../Configuraciones/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: 'calificacion',
        loadChildren: () => import('../calificacion/calificacion.module').then( m => m.CalificacionPageModule)
      },
      {
        path: 'dueno-local',
        children: [
          {
            path: 'lista-locales',
            loadChildren: () => import('../dueno-local/lista-locales/lista-locales.module').then( m => m.ListaLocalesPageModule)
          },
          {
            path: 'modificar-local',
            loadChildren: () => import('../dueno-local/modificar-local/modificar-local.module').then( m => m.ModificarLocalPageModule)
          },
          {
            path: 'agregar-local',
            loadChildren: () => import('../dueno-local/agregar-local/agregar-local.module').then( m => m.AgregarLocalPageModule)
          },
          {
            path: 'lista-productos',
            loadChildren: () => import('../dueno-local/lista-productos/lista-productos.module').then( m => m.ListaProductosPageModule)
          },
          {
            path: 'agregar-producto',
            loadChildren: () => import('../dueno-local/agregar-producto/agregar-producto.module').then( m => m.AgregarProductoPageModule)
          },
          {
            path: 'modificar-producto',
            loadChildren: () => import('../dueno-local/modificar-producto/modificar-producto.module').then( m => m.ModificarProductoPageModule)
          },
        ]
      },
      {
        path: 'editar-usuario',
        loadChildren: () => import('../editar-usuario/editar-usuario.module').then( m => m.EditarUsuarioPageModule)
      },
      {
        path: 'favoritos',
        loadChildren: () => import('../favoritos/favoritos.module').then( m => m.FavoritosPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/tab2',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
