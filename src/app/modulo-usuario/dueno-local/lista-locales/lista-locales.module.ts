import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaLocalPageRoutingModule } from './lista-locales-routing.module';

import { ListaLocalPage } from './lista-locales.page';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaLocalPageRoutingModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule
  ],
  declarations: [ListaLocalPage]
})
export class ListaLocalesPageModule {}
