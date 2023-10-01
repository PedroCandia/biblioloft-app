import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarLibrosPage as LibrosAdminPage } from './libros-admin.page';

const routes: Routes = [
  {
    path: '',
    component: LibrosAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LibrosAdminPageRoutingModule {}
