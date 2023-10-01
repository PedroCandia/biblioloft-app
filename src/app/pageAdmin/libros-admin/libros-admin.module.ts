import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LibrosAdminPageRoutingModule as LibrosAdminPageRoutingModule } from './libros-admin-routing.module';

import { AgregarLibrosPage as LibrosAdminPage } from './libros-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LibrosAdminPageRoutingModule
  ],
  declarations: [LibrosAdminPage]
})
export class LibrosAdminPageModule {}
