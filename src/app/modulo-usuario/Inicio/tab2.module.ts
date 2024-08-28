import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Tab2Page } from './tab2.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';
import { FrmFiltrosComponent } from '../components/frm-filtros/frm-filtros.component';
import { Tab2PageRoutingModule } from './tab2-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDivider, MatDividerModule } from '@angular/material/divider';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab2PageRoutingModule,
    MatDialogModule, 
    MatCardModule,
    MatIconModule,
    FrmFiltrosComponent,
    MatDividerModule
  ],
  declarations: [
    Tab2Page,
  ]
})
export class Tab2PageModule {}