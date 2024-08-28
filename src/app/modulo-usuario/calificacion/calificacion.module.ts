import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalificacionPageRoutingModule } from './calificacion-routing.module';

import { CalificacionPage } from './calificacion.page';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { IonRatingStarsComponent } from 'ion-rating-stars';
import { MatCardModule } from '@angular/material/card';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatCardModule,
    CalificacionPageRoutingModule,
    IonRatingStarsComponent,
IonicModule, MatDialogModule, MatInputModule, MatSelectModule, MatSliderModule,MatInputModule, MatDividerModule, MatButtonModule, MatIconModule, FormsModule, MatCheckboxModule
  ],
  declarations: [CalificacionPage]
})
export class CalificacionPageModule {}
