import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DataBookPageRoutingModule } from './data-book-routing.module';

import { DataBookPage } from './data-book.page';
import { BarNavigationComponent } from '../bar-navigation/bar-navigation.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DataBookPageRoutingModule,
    SharedModule
  ],
  declarations: [DataBookPage]
})
export class DataBookPageModule {}
