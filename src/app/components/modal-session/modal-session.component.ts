import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { BooksInfoService } from 'src/app/service/BooksInfo/books-info.service';
import { GoogleBooksService } from 'src/app/service/googleBooks/google-books.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getDatabase, ref, remove, set, get, onValue, update } from 'firebase/database';
import { AlertController, ToastController } from '@ionic/angular';
import { SharedService } from 'src/app/shared/shared.service';
@Component({
  selector: 'app-modal-session',
  templateUrl: './modal-session.component.html',
  styleUrls: ['./modal-session.component.scss'],
})
export class ModalSessionComponent implements OnInit {
  @Input() itemS: string;

  uid: string;
  dataUser = {
    email: false,
    nombre: false
  };
  dataSession = {
    idBook: '',
    startTS: 0,
    endTS: 0
  };
  dataRecentBook;
  recentBooksArray: Array<any> = [];
  ionSelectValue: any;

  dataSessionBook;
  sessionsBooksArray: Array<any> = [];
  weekDays = ['Domingo', 'Lunes', 'Martes', 'Mieroles', 'Jueves', 'Viernes', 'Sabado'];

  itemSessionTS: any;
  sessionToShow: any;

  allArrays: any = {
    reading: { book: [] }
  };

  dateSessionStart: any;
  dateSessionEnd: any;


  constructor(
    private modalController: ModalController,
    public booksService: BooksInfoService,
    public gbooksService: GoogleBooksService,
    public atrCtrl: AlertController,
    public angularFireAuth: AngularFireAuth,
    private toastController: ToastController,
    private shared: SharedService
  ) { }

  ngOnInit() {
    this.itemSessionTS = this.itemS;

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        if (uid) {
          this.getInfo();
        }
      }
    });
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  async getInfo() {
    const uid = await this.booksService.getUid();
    if (uid) {
      this.uid = uid;
      this.getUser(uid);
      this.getRecentBooks(uid);
      if (this.itemSessionTS) {
        this.getInfoSessionToEdit(uid, this.itemSessionTS);
      }
    }
    else {
      console.log('error');
    }
  }

  async getUser(userID) {
    const db = getDatabase();
    const usersRef = ref(db, 'users/' + userID);
    onValue(usersRef, (snapshot) => {
      this.dataUser = snapshot.val();
    });
  }

  async getRecentBooks(userID) {
    // const db = getDatabase();
    // const usersRef = ref(db, `users/${userID}/recentBooks`);
    // onValue(usersRef, (snapshot) => {
    //   this.dataRecentBook = snapshot.val();
    //   this.recentBooksArray.length = 0;
    //   Object.keys(this.dataRecentBook).forEach(async (volId) =>{
    //     this.gbooksService.getById(volId)
    //     .subscribe(res =>{
    //       this.dataRecentBook = res;
    //       this.recentBooksArray.push(this.dataRecentBook);
    //     });
    //   });
    // });
    const db = getDatabase();
    const usersRef = ref(db, `users/${userID}/allBooks`);
    onValue(usersRef, (snapshot) => {
      if (this.allArrays) {
        this.allArrays = {};
      }
      this.allArrays.allBooks = snapshot.val();
      //Verificar si existe el nodo allBooks
      if (this.allArrays.allBooks) {
        Object.keys(this.allArrays.allBooks).forEach(async (volId) => {
          const book = await this.gbooksService.getById(volId).toPromise();
          //Verificar si el nodo contiene reading
          if (this.allArrays.allBooks[volId]?.reading) {
            if (!this.allArrays.reading) {
              this.allArrays.reading = [];
            }
            //Introducirlo al arreglo reading si tiene el atributo reading
            this.allArrays.reading.push(this.allArrays.allBooks[volId]);
            if (!this.allArrays.reading?.book) {
              this.allArrays.reading.book = [];
            }
            this.allArrays.reading.book.push(book);
          }
        });
      }
    });
  }

  async createReading(dataSession) {
    if (!(dataSession.idBook && dataSession.startTS && dataSession.endTS)) {
      const alertConfirm = this.atrCtrl.create({
        message: 'Datos incompletos',
        buttons: [
          {
            text: 'Aceptar',
          }
        ]
      });
      (await alertConfirm).present();
      return;
    }
    try {
      const db = getDatabase();
      this.angularFireAuth.currentUser.then(user => {
        if (!this.itemSessionTS) {
          set(ref(db, `users/${user.uid}/sessions/${dataSession.startTS}`), {
            idBook: dataSession.idBook,
            startTS: dataSession.startTS,
            endTS: dataSession.endTS
          });
        } else {
          //cuando se esta editando
          if (dataSession.startTS === this.itemSessionTS) {
            set(ref(db, `users/${user.uid}/sessions/${this.itemSessionTS}`), {
              idBook: dataSession.idBook,
              startTS: dataSession.startTS,
              endTS: dataSession.endTS
            });
          } else {
            set(ref(db, `users/${user.uid}/sessions/${dataSession.startTS}`), {
              idBook: dataSession.idBook,
              startTS: dataSession.startTS,
              endTS: dataSession.endTS
            });
            remove(ref(db, `users/${user.uid}/sessions/${this.itemSessionTS}`));
          }
        }
        const payload = {
          notification: {
            title: 'Nueva sesion de lectura',
            body: 'Nueva sesion de lectura creada!',
          }
        };
      })
        .then(async () => {
          await this.getSessions(this.uid);
          if (!this.itemSessionTS) {
            this.shared.disparadorDeDatos.emit({ data: this.sessionsBooksArray, type: 'add' });
            this.presentToast('Sesión programada!');
          } else {
            this.shared.disparadorDeDatos.emit({ type: 'edit' });
            this.presentToast('Sesión editada!');
          }
          this.dismissModal();
          set(ref(db, 'users/' + this.uid +'/achievements/achievement4'), {
            id: 'achievement 4',
            url: 'https://cdn.discordapp.com/attachments/522699340771360773/972209907669540924/Logro5.png',
            title: 'Organizado',
            description: 'Crea una sesión de lecturas'
          });
        });
    } catch (error) {
      console.log('Error');
    }
  }

  valueIonSelect(event: any) {
    this.dataSession.idBook = event.detail.value;
  }

  valueDateSelectStart(event: any) {
    const date = new Date(event.detail.value);
    const timestamp = date.getTime();
    this.dataSession.startTS = timestamp;
  }

  valueDateSelectEnd(event: any){
    const date = new Date(event.detail.value);
    const timestamp = date.getTime();
    this.dataSession.endTS = timestamp;
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1000
    });
    toast.present();
  }


  getSessions(userID) {
    const db = getDatabase();
    const usersRef = ref(db, `users/${userID}/sessions`);
    // onValue(usersRef, (snapshot) => {
    get(usersRef).then((snapshot) => {
      this.sessionsBooksArray = [];
      this.dataSessionBook = {};
      this.dataSessionBook = snapshot.val();
      Object.keys(this.dataSessionBook).forEach(async (el) => {
        const format = {
          weekDays: '',
          day: 0,
          mes: 0,
          year: 0,
          hour: 0,
          min: 0,
          lengthMin: 0
        };
        const date = new Date(this.dataSessionBook[el].ts);
        const weekDays = date.getDay();
        format.weekDays = this.weekDays[weekDays];
        const day = date.getDate();
        format.day = day;
        const mes = date.getMonth();
        format.mes = mes + 1;
        const year = date.getFullYear();
        format.year = year;
        const hour = date.getHours();
        format.hour = hour;
        const minutos = date.getMinutes();
        format.min = minutos;
        format.lengthMin = minutos.toString().length;

        const obj: any = {};
        obj.format = format;
        obj.ts = this.dataSessionBook[el].ts;
        // this.sessionsTS.push(format);
        await this.gbooksService.getById(this.dataSessionBook[el].idBook)
          .subscribe(res => {
            obj.bookData = res;
            this.sessionsBooksArray.push(obj);
          });
      });
    });
  }

  getInfoSessionToEdit(uid, itemSessionTS) {
    let sessionInfo;
    const db = getDatabase();
    const sessionRef = ref(db, `users/${uid}/sessions/${itemSessionTS}`);
    const sessionInfoDB = get(sessionRef).then(async snapshot => {
      sessionInfo = snapshot.val();
      const format = {
        weekDays: '',
        day: 0,
        mes: 0,
        year: 0,
        hour: 0,
        min: 0,
        lengthMin: 0
      };
      const date = new Date(sessionInfo.ts);
      const weekDays = date.getDay();
      format.weekDays = this.weekDays[weekDays];
      const day = date.getDate();
      format.day = day;
      const mes = date.getMonth();
      format.mes = mes + 1;
      const year = date.getFullYear();
      format.year = year;
      const hour = date.getHours();
      format.hour = hour;
      const minutos = date.getMinutes();
      format.min = minutos;
      format.lengthMin = minutos.toString().length;
      this.dateSessionStart = `${year}-${mes < 10 ? '0' : ''}${mes + 1}-${day < 10 ? '0' : ''}
      ${day}T${hour < 10 ? '0' : ''}${hour}:${minutos < 10 ? '0' : ''}${minutos}`;
      const obj: any = {};
      obj.format = format;
      obj.ts = sessionInfo.ts;
      // this.sessionsTS.push(format);
      await this.gbooksService.getById(sessionInfo.idBook)
        .subscribe(res => {
          obj.bookData = res;
          this.sessionToShow = obj;
          console.log(this.sessionToShow);
        });
    });
  }
}
