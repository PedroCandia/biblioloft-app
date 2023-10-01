import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { getDatabase, ref, set, update, onValue } from 'firebase/database';
import { GoogleBooksService } from 'src/app/service/googleBooks/google-books.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-register-progress',
  templateUrl: './register-progress.component.html',
  styleUrls: ['./register-progress.component.scss'],
})
export class RegisterProgressComponent implements OnInit {
  @Input() uid: string;
  @Input() idBook: string;
  @Input() bookTS: string;
  @Input() recentBooksArray: string;

  lastPage: number;
  currentPage;
  finished: boolean;
  infoBook;
  constructor(
    private modalController: ModalController,
    private shared: SharedService,
    public gbooksService: GoogleBooksService,
    private toastController: ToastController,
  ){ }

  ngOnInit() {
    this.getPage();
    this.getBook();
  }

  async saveLastPage(){
    if(!this.uid && !this.idBook && !this.lastPage && !this.finished){
      console.log('Error de parametros');
    }
    if(this.lastPage > this.infoBook.volumeInfo.pageCount){
      this.presentToast('El número de páginas es mayor al numero de páginas del libro');
      return;
    }
    const db = getDatabase();
    const lastPageRef = 'users/' + this.uid + '/allBooks/' + this.idBook;
    if(this.finished){
      await update(ref(db, lastPageRef), {
        lastPage: this.lastPage,
        finished: 1
      });
    } else {
      await update(ref(db, lastPageRef), {
        lastPage: this.lastPage
      });
    }

    const deleteSessionRef = 'users/' + this.uid + '/sessions/' + this.bookTS;
    await set(ref(db, deleteSessionRef), {});
    this.recentBooksArray[this.bookTS] = null;
    this.shared.disparadorDeDatos.emit({ data: this.recentBooksArray, type: 'lastPageDone' });
    this.dismissModal();
    console.log(this.lastPage);
  }

  getPage(){
    const db = getDatabase();
    const lastPageRef = ref(db, `users/${this.uid}/allBooks/${this.idBook}/lastPage`);
    onValue(lastPageRef, (snapshot) => {
      this.currentPage = snapshot.val();
    });
  }

  async getBook(){
    this.infoBook = await this.gbooksService.getById(this.idBook).toPromise();
    console.log(this.infoBook);
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1000
    });
    toast.present();
  }
}
