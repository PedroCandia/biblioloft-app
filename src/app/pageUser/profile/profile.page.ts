import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BooksInfoService } from 'src/app/service/BooksInfo/books-info.service';
import { AngularFireList } from '@angular/fire/compat/database';
import { getDatabase, onValue, ref, update } from 'firebase/database';
import { GoogleBooksService } from 'src/app/service/googleBooks/google-books.service';
import { ActivatedRoute, Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { ModalAchievementsComponent } from 'src/app/components/modal-achievements/modal-achievements.component';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  dataUser = {
    email: false,
    nombre: false,
    url: '',
    achievActual: false,
  };
  users: AngularFireList<any>;
  uid: string = null;
  loading;
  myProfile = false;
  noUser = false;
  allArrays: any = {
    allBooks : {book : []},
    favorite : {book : []},
    reading : {book : []},
    finished : {book : []}
  };
  constructor(
    public angularFireAuth: AngularFireAuth,
    public booksService: BooksInfoService,
    public gbooksService: GoogleBooksService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalController: ModalController,
    private toastController: ToastController,
    public atrCtrl: AlertController,
  ) {}

  async ngOnInit() {
    this.uid = this.activatedRoute.snapshot.paramMap.get('id');
    this.getInfo(this.uid);
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        if(uid){
          if(this.uid !== uid){
            this.myProfile = true;
          }
        }
      }
      else{
        this.noUser = true;
      }
    });
  }

  async getInfo(uid){
    if (uid){
      this.uid = uid;
      this.getUser(uid);
      this.getAllArrays(uid);
    }
    else{
      console.log('error');
    }
  }

  async getUser(userID) {
    const db = getDatabase();
    const usersInfoRef = ref(db, 'users/' + userID);
    onValue(usersInfoRef, (snapshot) => {
      this.dataUser = snapshot.val();
      const background = document.querySelector<HTMLElement>('.header-profile');
      background.style.backgroundImage = 'url(' + this.dataUser.url + ')';
    });
    // const achievRef = ref(db, 'users/' + userID +'/achievements/achievement1');
    // onValue(achievRef, (snapshot) => {
    //   this.dataAchievements = snapshot.val();
    // });
  }

  getAllArrays(userID){
    const db = getDatabase();
    const usersRef = ref(db, `users/${userID}/allBooks`);
    onValue(usersRef, (snapshot) => {
      if(this.allArrays){
        this.allArrays = {};
      }
      this.allArrays.allBooks = snapshot.val();
      //Verificar si existe el nodo allBooks
      if(this.allArrays.allBooks){
        Object.keys(this.allArrays.allBooks).forEach(async (volId) =>{
          const book = await this.gbooksService.getById(volId).toPromise();
          if(!this.allArrays.allBooks){
            this.allArrays.allBooks = [];
          }
          if(!this.allArrays.allBooks?.book){
            this.allArrays.allBooks.book = [];
          }
          this.allArrays.allBooks.book.push(book);
          //Verificar si el nodo contiene favoritos
          if(this.allArrays.allBooks[volId]?.favorite){
            if(!this.allArrays.favorite){
              this.allArrays.favorite = [];
            }
            //Introducirlo al arreglo favorite si tiene el atributo favorite
            this.allArrays.favorite.push(this.allArrays.allBooks[volId]);
            if(!this.allArrays.favorite?.book){
              this.allArrays.favorite.book = [];
            }
            this.allArrays.favorite.book.push(book);
          }
          //Verificar si el nodo contiene reading
          if(this.allArrays.allBooks[volId]?.reading){
            if(!this.allArrays.reading){
              this.allArrays.reading = [];
            }
            //Introducirlo al arreglo reading si tiene el atributo reading
            this.allArrays.reading.push(this.allArrays.allBooks[volId]);
            if(!this.allArrays.reading?.book){
              this.allArrays.reading.book = [];
            }
            this.allArrays.reading.book.push(book);
          }
          //Verificar si el nodo contiene finished
          if(this.allArrays.allBooks[volId]?.finished){
            if(!this.allArrays.finished){
              this.allArrays.finished = [];
            }
            //Introducirlo al arreglo finished si tiene el atributo finished
            this.allArrays.finished.push(this.allArrays.allBooks[volId]);
            if(!this.allArrays.finished?.book){
              this.allArrays.finished.book = [];
            }
            this.allArrays.finished.book.push(book);
          }
        });
      }
    });
  }

  async favSection(){
    const f = document.querySelector('#section-fav');
    const r = document.querySelector('#section-read');
    const a = document.querySelector('#section-all');
    const t = document.querySelector('#section-finished');

    f.classList.add('selected');
    r.classList.remove('selected');
    a.classList.remove('selected');
    t.classList.remove('selected');

    const fSection = document.querySelector('#fav-container');
    const rSection = document.querySelector('#read-container');
    const aSection = document.querySelector('#all-container');
    const tSection = document.querySelector('#finished-container');

    fSection.classList.add('selected-container');
    rSection.classList.remove('selected-container');
    aSection.classList.remove('selected-container');
    tSection.classList.remove('selected-container');
  }

  async readSection(){
    const f = document.querySelector('#section-fav');
    const r = document.querySelector('#section-read');
    const a = document.querySelector('#section-all');
    const t = document.querySelector('#section-finished');

    f.classList.remove('selected');
    r.classList.add('selected');
    a.classList.remove('selected');
    t.classList.remove('selected');

    const fSection = document.querySelector('#fav-container');
    const rSection = document.querySelector('#read-container');
    const aSection = document.querySelector('#all-container');
    const tSection = document.querySelector('#finished-container');

    fSection.classList.remove('selected-container');
    rSection.classList.add('selected-container');
    aSection.classList.remove('selected-container');
    tSection.classList.remove('selected-container');
  }

  async allSection(){
    const f = document.querySelector('#section-fav');
    const r = document.querySelector('#section-read');
    const a = document.querySelector('#section-all');
    const t = document.querySelector('#section-finished');

    f.classList.remove('selected');
    r.classList.remove('selected');
    a.classList.add('selected');
    t.classList.remove('selected');

    const fSection = document.querySelector('#fav-container');
    const rSection = document.querySelector('#read-container');
    const aSection = document.querySelector('#all-container');
    const tSection = document.querySelector('#finished-container');

    fSection.classList.remove('selected-container');
    rSection.classList.remove('selected-container');
    aSection.classList.add('selected-container');
    tSection.classList.remove('selected-container');
  }

  async finishedSection(){
    const f = document.querySelector('#section-fav');
    const r = document.querySelector('#section-read');
    const a = document.querySelector('#section-all');
    const t = document.querySelector('#section-finished');

    f.classList.remove('selected');
    r.classList.remove('selected');
    a.classList.remove('selected');
    t.classList.add('selected');

    const fSection = document.querySelector('#fav-container');
    const rSection = document.querySelector('#read-container');
    const aSection = document.querySelector('#all-container');
    const tSection = document.querySelector('#finished-container');

    fSection.classList.remove('selected-container');
    rSection.classList.remove('selected-container');
    aSection.classList.remove('selected-container');
    tSection.classList.add('selected-container');
  }

  goHome(){
    this.router.navigate(['tabs/home']);
  }

  goLogin(){
    this.router.navigate(['login']);
  }

  async openModalAchievements(){
    const modal = await this.modalController.create({
      component: ModalAchievementsComponent
    });
    return await modal.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1000
    });
    toast.present();
  }
}
