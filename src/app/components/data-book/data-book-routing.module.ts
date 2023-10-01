import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataBookPage } from './data-book.page';

const routes: Routes = [
  {
    path: '',
    component: DataBookPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataBookPageRoutingModule {}
