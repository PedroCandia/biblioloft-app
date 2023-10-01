import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroLibrosPage as PeticionesAdminPage } from './peticiones-admin.page';

const routes: Routes = [
  {
    path: '',
    component: PeticionesAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeticionesAdminPageRoutingModule {}
