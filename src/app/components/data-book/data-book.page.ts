import { Component, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { GoogleBooksService } from 'src/app/service/googleBooks/google-books.service';
import { getDatabase, ref, remove, set, onValue, update, get } from 'firebase/database';
import { AlertController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
// import * as ml5 from 'ml5';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-data-book',
  templateUrl: './data-book.page.html',
  styleUrls: ['./data-book.page.scss'],
})
export class DataBookPage implements OnInit, OnDestroy {

  loading;
  volumeId: string;
  book;
  //buttons comenzar a leer & fav
  addRead: boolean;
  addFav: boolean;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private gbook: GoogleBooksService,
    private toastController: ToastController,
    public angularFireAuth: AngularFireAuth,
    private router: Router,
    public atrCtrl: AlertController,
  ) { }

  ngOnInit() {
    this.volumeId = this.activatedRoute.snapshot.paramMap.get('id');
    this.gbook.getById(this.volumeId)
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(
        async res => {
          this.book = res;
          const auth = getAuth();
          onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
              this.readDB(currentUser);
            }
          });
        }
      );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  //Marcar checkbox si ya se encuentran en la DB
  async readDB(user){
    // const user = await this.angularFireAuth.currentUser;
    if(user){
      const db = getDatabase();
      const usersRef = ref(db, `users/${user.uid}/allBooks/${this.volumeId}/favorite`);
      onValue(usersRef, (snapshot) => {
        if (snapshot.exists()) {
          if(!this.addFav){
            this.addFav = true;
          }
        }
      });

      const usersRef2 = ref(db, `users/${user.uid}/allBooks/${this.volumeId}/reading`);
      onValue(usersRef2, (snapshot) => {
        if (snapshot.exists()) {
          if(!this.addRead){
            this.addRead = true;
          }
        }
      });
    }
  }



  checkboxDBfav(){
    if(!this.addFav){
      this.addFav = true;
      this.addToFav();
    } else {
      this.showConfirmAlert('Favoritos');
    }
  }

  checkboxDBrecent(){
    if(!this.addRead){
      this.addRead = true;
      this.addToRecent();
    } else {
      this.showConfirmAlert('Lecturas');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1000
    });
    toast.present();
  }

  addToFav(){
    try {
      const db = getDatabase();
      this.angularFireAuth.currentUser.then( user  => {
        update(ref(db, `users/${user.uid}/allBooks/${this.volumeId}`), {
        volID: this.volumeId,
        title: this.book.volumeInfo.title,
        favorite: '1'
      });
      set(ref(db, 'users/' + user.uid +'/achievements/achievement2'), {
        id: 'achievement 2',
        url: 'https://cdn.discordapp.com/attachments/522699340771360773/971273566857359420/Logro4.png',
        title: 'Comienza mi colección',
        description: 'Agrega un libro a favoritos'
      });
    })
      .then(()=>{
        this.presentToast('Libro agregado a favoritos');
      });
    } catch (error) {
      console.log('Error');
    }
  }

  addToRecent(){
    try {
      const db = getDatabase();
      this.angularFireAuth.currentUser.then( user  => {
        update(ref(db, `users/${user.uid}/allBooks/${this.volumeId}`), {
        volID: this.volumeId,
        title: this.book.volumeInfo.title,
        reading: '1'
      });
      set(ref(db, 'users/' + user.uid +'/achievements/achievement3'), {
        id: 'achievement 3',
        url: 'https://cdn.discordapp.com/attachments/522699340771360773/971272969072545872/Logro3.png',
        title: 'Ratón de biblioteca',
        description: 'Agrega un libro a lecturas'
      });
    })
      .then(()=>{
        this.presentToast('Libro agregado a lecturas');
      });
    } catch (error) {
      console.log('Error');
    }
  }

  goHome(){
    this.router.navigate(['tabs/home']);
  }

  goSession(){
    this.router.navigate(['tabs/session']);
  }

  goProfile(){
    this.router.navigate(['tabs/profile']);
  }

  goSettings() {
    this.router.navigate(['tabs/settings']);

  }

  removeTags(str) {
    if ((str===null) || (str==='')){
        return false;}
    else{
        str = str.toString();
      }
    return str.replace( /(<([^>]+)>)/ig, '');
  }

  async showConfirmAlert(type: string) {
    const alertConfirm = this.atrCtrl.create({
      message: '¿Estas seguro que deseas borrar "' + this.book.volumeInfo.title + '" de ' + type + '?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: async (): Promise<void> => {
            if(type === 'Favoritos'){
              //Eliminar libro de favoritos
              const db = getDatabase();
              const user = await this.angularFireAuth.currentUser;
              if(user){
                const usersRef = ref(db, `users/${user.uid}/allBooks/${this.volumeId}`);
                const [dataBookDB] = await Promise.all([get(usersRef)]);
                const dataBook = dataBookDB.val();
                if(!dataBook?.reading){
                  await Promise.all([remove(ref(db, `users/${user.uid}/allBooks/${this.volumeId}`),)]);
                }
                else{
                  await Promise.all([remove(ref(db, `users/${user.uid}/allBooks/${this.volumeId}/favorite`),)]);
                }
                this.addFav = false;
                this.presentToast('Libro eliminado de favoritos');
              }
            }
            if(type === 'Lecturas'){
              //Eliminar libros de lecturas
              const db = getDatabase();
              const user = await this.angularFireAuth.currentUser;
              if(user){
                const usersRef = ref(db, `users/${user.uid}/allBooks/${this.volumeId}`);
                const [dataBookDB] = await Promise.all([get(usersRef)]);
                const dataBook = dataBookDB.val();
                if(!dataBook?.favorite){
                  await Promise.all([remove(ref(db, `users/${user.uid}/allBooks/${this.volumeId}`),)]);
                }
                else{
                  await Promise.all([remove(ref(db, `users/${user.uid}/allBooks/${this.volumeId}/reading`),)]);
                }
                this.addRead = false;
                this.presentToast('Libro eliminado de lecturas');
              }
            }
          }
        }
      ]
    });
    (await alertConfirm).present();
  }


    // mlImage(){
    //   const imagen = document.getElementById('imagen');
    //   const newImage = new Image(110, 160);
    //   newImage.src = 'src/assets/img/content.jpg';
    //   const resultado = document.getElementById('resultado');
    //   const prob = document.getElementById('probabilidad');

    //   const clasificador = ml5.imageClassifier('MobileNet', () => {
    //     console.log('Modelo cargado..');
    //   });
    //   setTimeout(() => {
    //     clasificador.predict(newImage, (err, res) => {
    //       console.log(res);
    //     });
    //   }, 10000);
    // }

    mlImage(url: string) {
      //const imagen = document.getElementById('imagen');

      fetch(url)
        .then(resp => resp.blob())
        .then(blob => {
          const img = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = img;
          a.download = 'ImagenLibro.png';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(img);
        })
        .catch(() => alert('Error'));

      // const resultado = document.getElementById('resultado');
      // const prob = document.getElementById('probabilidad');

      // const clasificador = ml5.imageClassifier('MobileNet', () => {
      //   console.log('Modelo cargado..');
      // });
      // setTimeout(() => {
      //   clasificador.predict(imagen, (err, res) => {
      //     console.log(res);
      //   });
      // }, 10000);
    }

    // downloadImage(url1, name){

    //   const urlFinal = url1.replace('&source=gbs_api', ' ');

    //   let img;

    //   fetch(urlFinal, {mode: 'cors'})
    //     .then(resp => resp.blob())
    //     .then(blob => {
    //         const url = window.URL.createObjectURL(blob);
    //         const a = document.createElement('a');
    //         a.style.display = 'none';
    //         a.href = url;
    //         // the filename you want
    //         a.download = name;
    //         document.body.appendChild(a);

    //         const aCClick = a.click();

    //         console.log(aCClick);

    //         const clasificador = ml5.imageClassifier('MobileNet', () => {
    //           console.log('Modelo cargado..');
    //         });
    //         setTimeout(() => {
    //           clasificador.predict(aCClick, (err, res) => {
    //             console.log(res);
    //           });
    //         }, 10000);

    //         window.URL.revokeObjectURL(url);
    //     })
    //     .catch(() => alert('Para descargar la imagen\nse requiere instalar la extensión\nMoesif Origin & CORS Changer en su navegador'));
    // }
}




