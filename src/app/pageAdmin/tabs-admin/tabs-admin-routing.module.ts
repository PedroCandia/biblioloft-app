import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsAdminPage } from './tabs-admin.page';

const routes: Routes = [
  {
    path: '',
    component: TabsAdminPage,
    children: [
      {
        path: 'libros',
        children: [
          {
            path: '',
            loadChildren: () => import('../libros-admin/libros-admin.module').then(m => m.LibrosAdminPageModule)
          }
        ]
      },
      {
        path: 'peticiones',
        children: [
          {
            path: '',
            loadChildren: () => import('../peticiones-admin/peticiones-admin.module').then(m => m.PeticionesAdminPageModule)
          }
        ]
      },
      {
        path: 'settings-admin',
        children: [
          {
            path: '',
            loadChildren: () => import('../settings-admin/settings-admin.module').then(m => m.SettingsAdminPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs-admin/agregar-libros',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs-admin/agregar-libros',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsAdminPageRoutingModule {}
