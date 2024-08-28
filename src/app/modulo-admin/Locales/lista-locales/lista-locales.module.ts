import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaLocalesPageRoutingModule } from './lista-locales-routing.module';

import { ListaLocalesPage } from './lista-locales.page';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaLocalesPageRoutingModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatDivider
  ],
  
  declarations: [ListaLocalesPage]
})
export class ListaLocalesPageModule {}
