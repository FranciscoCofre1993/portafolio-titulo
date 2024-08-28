import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangelogPageRoutingModule } from './changelog-routing.module';

import { ChangelogPage } from './changelog.page';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatCardModule,
    ChangelogPageRoutingModule
  ],
  declarations: [ChangelogPage]
})
export class ChangelogPageModule {}
