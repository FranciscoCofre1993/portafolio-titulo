import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TabsAdminPageRoutingModule } from './tabs-admin-routing.module';
import { TabsAdminPage } from './tabs-admin.page';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsAdminPageRoutingModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule
  ],
  declarations: [TabsAdminPage],
})
export class TabsAdminPageModule {}
