import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DetalleLocalPageRoutingModule } from './detalle-local-routing.module';
import { DetalleLocalPage } from './detalle-local.page';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { IonRatingStarsComponent } from 'ion-rating-stars';
import {  MatCarouselModule } from '@nunomeirelesjumia/material-carousel';
import { MatCarouselSlide, MatCarouselSlideComponent } from '@nunomeirelesjumia/material-carousel';
import { Directory, Filesystem } from '@capacitor/filesystem';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleLocalPageRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatIcon,
    MatIconModule,
    IonRatingStarsComponent,
    MatCarouselModule,
    
  ],
  declarations: [DetalleLocalPage]
})
export class DetalleLocalPageModule {}
