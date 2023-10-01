import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { ModalSessionComponent } from 'src/app/components/modal-session/modal-session.component';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { BooksInfoService } from 'src/app/service/BooksInfo/books-info.service';
import { getDatabase, ref, remove, set, get, onValue } from 'firebase/database';
import { GoogleBooksService } from 'src/app/service/googleBooks/google-books.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { SharedService } from 'src/app/shared/shared.service';
import { HttpClient } from '@angular/common/http';
import { RegisterProgressComponent } from './componets/register-progress/register-progress.component';
import { Subject, Subscription } from 'rxjs';
import { ApiRestService } from 'src/app/service/ApiRest/api-rest.service';

@Component({
  selector: 'app-session',
  templateUrl: './session.page.html',
  styleUrls: ['./session.page.scss'],
})
export class SessionPage implements OnInit {

  @ViewChild(ModalSessionComponent) booksArrayFromModal;

  uid: string;
  message;
  dataRecentBook: any = {};
  recentBooksArray: any = [];
  weekDays = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  itemSelectedValue: boolean;
  itemSessionsTS = [];
  tokenUser;
  sendNotification = 0;
  suscription: Subscription;
  suscription2: Subscription;
  private refresh$ = new Subject<void>();
  private refresh2$ = new Subject<void>();

  constructor(
    private modalController: ModalController,
    public booksService: BooksInfoService,
    public gbooksService: GoogleBooksService,
    public atrCtrl: AlertController,
    public angularFireAuth: AngularFireAuth,
    private toastController: ToastController,
    private shared: SharedService,
    private http: HttpClient,
    private msgService: ApiRestService,
    ) {}

  get refreshDate$(){
    return this.refresh$;
  }

  get refreshDate2$(){
    return this.refresh2$;
  }

  ngOnInit() {
    //el sig subscribe recibe los datos de cuando se agrega una session
    this.shared.disparadorDeDatos.subscribe(async data => {
      if(data.type === 'edit'){
        this.itemSessionsTS = [];
        this.itemSelectedValue = false;
      }
      if(data.type === 'lastPageDone'){
        const alertConfirm = this.atrCtrl.create({
          message: 'Datos registrados!',
          buttons: [
            {
              text: 'Aceptar',
            }
          ]
        });
        (await alertConfirm).present();
      }
      this.getSessions(this.uid);
    });
    this.suscription = this.refresh$.subscribe(async () => {
      this.requestNotification(0);
      const alertConfirm = this.atrCtrl.create({
        message: 'Sesión terminada!',
        buttons: [
          {
            text: 'Aceptar',
          }
        ]
      });
      (await alertConfirm).present();
    });

    this.suscription2 = this.refresh2$.subscribe(async () => {
      this.requestNotification(1);
      const alertConfirm = this.atrCtrl.create({
        message: 'Comienza sesión de lectura!',
        buttons: [
          {
            text: 'Aceptar',
          }
        ]
      });
      (await alertConfirm).present();
    });

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        if(uid){
          this.uid = uid;
          this.msgService.getPermission(this.uid);
          this.msgService.recieveMessage();
          this.message = this.msgService.currentMessage;
          this.getSessions(this.uid);
          this.getToken(this.uid);
        }
      }
    });
  }

  getSessions(userID) {
    const db = getDatabase();
    const usersRef = ref(db, `users/${userID}/sessions`);
    // onValue(usersRef, (snapshot) => {
    get(usersRef).then((snapshot) => {
      this.recentBooksArray = [];
      this.dataRecentBook = {};
      this.dataRecentBook = snapshot.val();
      if(!this.dataRecentBook){
        return;
      }
      Object.keys(this.dataRecentBook).forEach(async (el) =>{
        const formatStart = {
          weekDays: '',
          day: 0,
          mes: 0,
          year: 0,
          hour: 0,
          min: 0,
          lengthMin: 0
        };
        const formatEnd = {
          weekDays: '',
          day: 0,
          mes: 0,
          year: 0,
          hour: 0,
          min: 0,
          lengthMin: 0
        };
        const date = new Date(this.dataRecentBook[el].startTS);
        const weekDays = date.getDay();
        formatStart.weekDays = this.weekDays[weekDays];
        const day = date.getDate();
        formatStart.day = day;
        const mes = date.getMonth();
        formatStart.mes = mes+1;
        const year = date.getFullYear();
        formatStart.year = year;
        const hour = date.getHours();
        formatStart.hour = hour;
        const minutos = date.getMinutes();
        formatStart.min = minutos;
        formatStart.lengthMin = minutos.toString().length;

        const dateEnd = new Date(this.dataRecentBook[el].endTS);
        const weekDaysEnd = dateEnd.getDay();
        formatEnd.weekDays = this.weekDays[weekDaysEnd];
        const dayEnd = dateEnd.getDate();
        formatEnd.day = dayEnd;
        const mesEnd = dateEnd.getMonth();
        formatEnd.mes = mesEnd+1;
        const yearEnd = dateEnd.getFullYear();
        formatEnd.year = yearEnd;
        const hourEnd = dateEnd.getHours();
        formatEnd.hour = hourEnd;
        const minutosEnd = dateEnd.getMinutes();
        formatEnd.min = minutosEnd;
        formatEnd.lengthMin = minutosEnd.toString().length;

        const obj: any = {};
        obj.formatStart = formatStart;
        obj.formatEnd = formatEnd;
        obj.startTS = this.dataRecentBook[el].startTS;
        obj.endTS = this.dataRecentBook[el].endTS;
        obj.notification = 0;
        obj.notification2 = 0;
        // this.sessionsTS.push(format);
        await this.gbooksService.getById(this.dataRecentBook[el].idBook)
        .subscribe(res =>{
          obj.bookData = res;
          this.recentBooksArray.push(obj);
        });
      });
      //ordenar aqui
      // console.log(this.recentBooksArray);
    });
  }

  getToken(userID){
    const db = getDatabase();
    const usersRef = ref(db, `users/${userID}/tokenUser`);
    onValue(usersRef, (snapshot) => {
      if(snapshot){
        this.tokenUser = snapshot;
      }
    });
  }

  // Si se agrega una session no se pasa el parametro
  // En caso de editar un libro se pasa su id(que es su timestamp(ts)) - en verdad se pasa el arreglo con los libros seleccionados:)
  async openSessionModal(type) {
    let sessionTS;
    if(type === 'edit'){
      sessionTS = this.itemSessionsTS[0];
    }
    const modal = await this.modalController.create({
      component: ModalSessionComponent,
      componentProps: {
        itemS: sessionTS,
      }
    });

    return await modal.present();
  }

  async deleteSession(){
    const alertConfirm = await this.atrCtrl.create({
      message: '¿Estas seguro que deseas borrar esta session?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: () => {
            //Eliminar session
            const db = getDatabase();
            this.itemSessionsTS.forEach( ts => {
              remove(ref(db, `users/${this.uid}/sessions/${ts}`));
            });
            this.itemSessionsTS = [];
            // si se estan desmarcando tiene que llegar a 0
            this.itemSelectedValue = false;
            this.getSessions(this.uid);
            this.presentToast('Session eliminada');
          }
        }
      ]
    });
    (await alertConfirm).present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1000
    });
    toast.present();
  }

  itemSelected(sessionTS){
    // se crea variable para saber con cuanto tamaño entra el array(this.itemSessionTS)
    const firstLength = this.itemSessionsTS.length;
    if(this.itemSessionsTS){
      this.itemSessionsTS = this.itemSessionsTS.filter(el =>
        el !== sessionTS
      );
    }
    // condicion si no se removio un elemento se hace push al array
    if(this.itemSessionsTS.length === firstLength){
      this.itemSessionsTS.push(sessionTS);
    }

    // si se agrega el primer elemento y aun no es true se activa los botones de editar y eliminar
    if(this.itemSessionsTS.length === 1){
      if(!this.itemSelectedValue){
        this.itemSelectedValue = true;
      }
    }

    // si se estan desmarcando tiene que llegar a 0
    if(this.itemSelectedValue && this.itemSessionsTS.length === 0){
      this.itemSelectedValue = false;
    }
  }

  checkIfSessionEnded(ts: number){
    const now = (new Date()).getTime();
    const sessionEnded = now - ts;
    if(sessionEnded > 0){
      if(!this.tokenUser){
        return;
      }
      this.recentBooksArray.forEach(async el => {
        if(el.endTS === ts && el.notification === 0){
          console.log('noti enviada');
          this.refresh$.next();
          el.notification = 1;
        }
      });
      return true;
    } else {
      return false;
    }
  }

  checkIfSessionStarted(ts: number){
    const now = (new Date()).getTime();
    const sessionStarted = now - ts;
    if(sessionStarted > 0){
      if(!this.tokenUser){
        return;
      }
      this.recentBooksArray.forEach(async el => {
        if(el.startTS === ts && el.notification2 === 0){
          console.log('noti enviada 2');
          this.refresh2$.next();
          el.notification2 = 1;
        }
      });
      return true;
    } else {
      return false;
    }
  }

  async requestNotification(type){
    if(type){
      const headers = {'content-Type': 'application/json' };
      const data: any = {
        title: 'Comienza sesión de lectura',
        body: 'Mucha suerte y diviertete! :)',
        icon: 'https://media.discordapp.net/attachments/807789869321420811/953046106097451018/Logo_V1.png?width=507&height=676',
        userId: this.uid,
        token: this.tokenUser
      };
      console.log(this.uid, this.tokenUser);
      this.http.post('http://localhost:3000/api/notifications', data, { headers }).subscribe(el => {
          // console.log(el);
      });
    } else {
      const headers = {'content-Type': 'application/json' };
      const data: any = {
        title: 'Sesión terminada',
        body: 'Sesión de lectura terminada, no olvides registrar tus avances!',
        icon: 'https://media.discordapp.net/attachments/807789869321420811/953046106097451018/Logo_V1.png?width=507&height=676',
        userId: this.uid,
        token: this.tokenUser
      };
      console.log(this.uid, this.tokenUser);
      this.http.post('http://localhost:3000/api/notifications', data, { headers }).subscribe(el => {
          // console.log(el);
      });
    }
  }

  // this.http.get('http://localhost:3000/api/notifications').subscribe(data => {
  //   console.log(data);
  // });
  // const headers = { 'Authorization': 'Bearer my-token', 'My-Custom-Header': 'foobar' };
  // const body = { title: 'Angular POST Request Example' };
  // this.http.post<any>('https://reqres.in/api/posts', body, { headers }).subscribe(data => {
  //     this.postId = data.id;
  // });

  async openModalRegisterProgress(idBookSession, bookSessionTS){
    const modal = await this.modalController.create({
      component: RegisterProgressComponent,
      componentProps: {
        uid: this.uid,
        idBook: idBookSession,
        bookTS: bookSessionTS,
        recentBooksArray: this.recentBooksArray
      }
    });
    return await modal.present();
  }
}
