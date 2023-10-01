import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { BookPreviewComponent } from '../../components/book-preview/book-preview.component';
import { EllipsisPipe } from '../../shared/elipsis.pipe';
import { BarNavigationComponent } from 'src/app/components/bar-navigation/bar-navigation.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedModule
  ],
  declarations: [HomePage, EllipsisPipe]
})
export class HomePageModule {}
