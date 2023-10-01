import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PeticionesAdminPageRoutingModule as PeticionesAdminPageRoutingModule } from './peticiones-admin-routing.module';

import { RegistroLibrosPage as PeticionesAdminPage } from './peticiones-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PeticionesAdminPageRoutingModule
  ],
  declarations: [PeticionesAdminPage]
})
export class PeticionesAdminPageModule {}
