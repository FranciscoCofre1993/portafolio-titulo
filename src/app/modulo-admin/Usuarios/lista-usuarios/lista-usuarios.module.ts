import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaUsuariosPageRoutingModule } from './lista-usuarios-routing.module';

import { ListaUsuariosPage } from './lista-usuarios.page';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaUsuariosPageRoutingModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule
  ],
  declarations: [ListaUsuariosPage]
})
export class ListaUsuariosPageModule {}
