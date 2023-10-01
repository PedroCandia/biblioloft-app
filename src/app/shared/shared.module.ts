import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarNavigationComponent } from '../components/bar-navigation/bar-navigation.component';
import { BookPreviewComponent } from '../components/book-preview/book-preview.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [BarNavigationComponent, BookPreviewComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports:[BarNavigationComponent, BookPreviewComponent]
})
export class SharedModule { }
