import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireList } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { PatternValidator, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { debug } from 'console';
import { getDatabase, limitToFirst, onValue, ref, set, update } from 'firebase/database';
import { AuthService } from 'src/app/service/AuthFirebase/auth.service';
import { BooksInfoService } from 'src/app/service/BooksInfo/books-info.service';
import { User } from 'src/app/shared/user.interface';
import { ModalLoginComponent } from '../modal-login/modal-login.component';
import { StorageserviceService } from 'src/app/service/Storage/storage-service.service';
import { url } from 'inspector';
@Component({
  selector: 'app-modal-modify-profile',
  templateUrl: './modal-modify-profile.component.html',
  styleUrls: ['./modal-modify-profile.component.scss'],
})
export class ModalModifyProfileComponent implements OnInit {

  data = {
    email: false,
    nombre: false,
    url: false
  };
  user = {
    uid: '',
    email: '',
    emailVerified: true,
    displayName: '',
  };
  users: AngularFireList<any>;
  uid: string = null;

  profilePic;

  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private autsvc: AuthService,
    public angularFireAuth: AngularFireAuth,
    public booksService: BooksInfoService,
    private auth: AuthService,
    private storageService: StorageserviceService
    ) { }

  ngOnInit() {
    this.readDB();
  }

  uploadImagetoFirebase(event){
    const files = event.target.files;
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onloadend = () => {
      console.log(reader.result);
      this.profilePic = reader.result;
      this.storageService.uploadImage(this.uid, reader.result).then(urlImg=>{
        this.profilePic = urlImg;
        const db = getDatabase();
        this.angularFireAuth.currentUser.then( user  => {
          update(ref(db, `users/${user.uid}`), {
            url: urlImg
          });
       })
        .then(()=>{
          this.presentToast('Imagen guardada');
        });
      });
    };
  }

  async readDB() {
    await this.delay(500);
    const uid = await this.booksService.getUid();
    if (uid) {
      this.uid = uid;
      this.getUsers(uid);
    }
    else {
      console.log('error');
    }
  }
  async getUsers(userID) {
    await this.delay(1000);
    const db = getDatabase();
    const usersRef = ref(db, 'users/' + userID);
    onValue(usersRef, (snapshot) => {
      this.data = snapshot.val();
    });
  }


  dismissModal() {
    this.modalController.dismiss();
  }

  saveChanges() {
    const db = getDatabase();
    // const mailInput = (document.getElementById('mailInput') as HTMLInputElement).value;
    const nameInput = (document.getElementById('nameInput') as HTMLInputElement).value;

    const updates = {};
    // if(mailInput !== ''){
    //   if(mailInput){
    //     this.user.email = mailInput;
    //     console.log(this.user.email);
    //   }
    //   console.log(this.auth.isEmailVerified(this.user));
    //   const verified = this.auth.isEmailVerified(this.user);
    //   if(verified === true){
    //     updates['users/' + this.uid + '/email'] = mailInput;
    //     this.modalController.dismiss();
    //     this.presentToast('Se guardaron los cambios correctamente');
    //   }
    //   else{
    //     this.presentToast('El correo electronico debe ser verificable');
    //   }
    // }
    if(nameInput !== ''){
      updates['users/' + this.uid + '/nombre'] = nameInput;
      this.modalController.dismiss();
      this.presentToast('Se guardaron los cambios correctamente');
    }
  return update(ref(db), updates);
  }

  editMail(){
    const foo = document.getElementById('mailInputContainer');
    foo.style.display = 'flex';
    const foo2 = document.getElementById('mailText');
    foo2.style.display = 'none';

    const inputMail = document.getElementById('mailInput') as HTMLInputElement;
    const btn = document.getElementById('saveBtn') as HTMLButtonElement ;
    btn.disabled = true;

    inputMail.addEventListener('input', function(){
      if(this.value !== ''){
        btn.disabled = false;
      } else {
        btn.disabled = true;
      }
    });

  }
  editName(){
    const foo = document.getElementById('nameInputContainer');
    foo.style.display = 'flex';
    const foo2 = document.getElementById('nameText');
    foo2.style.display = 'none';

    const inputName = document.getElementById('nameInput') as HTMLInputElement;
    const btn = document.getElementById('saveBtn') as HTMLButtonElement;
    btn.disabled = true;

    inputName.addEventListener('input', function(){
      this.value.trimStart().trimEnd();
      if(this.value !== ''){
        btn.disabled = false;
      } else {
        btn.disabled = true;
      }
    });
  }

  disableBtn(){
    const btn = document.getElementById('saveBtn') as HTMLButtonElement;
    btn.disabled = true;
  }
  cancelName(){
    const foo = document.getElementById('nameInputContainer') as HTMLInputElement;
    foo.style.display = 'none';
    const foo2 = document.getElementById('nameText');
    foo2.style.display = 'flex';
    const inputName = document.getElementById('nameInput') as HTMLInputElement;
    inputName.value = '';

    this.disableBtn();
  }

  cancelMail(){
    const foo = document.getElementById('mailInputContainer');
    foo.style.display = 'none';
    const foo2 = document.getElementById('mailText');
    foo2.style.display = 'flex';
    const inputMail = document.getElementById('mailInput') as HTMLInputElement;
    inputMail.value = '';

    this.disableBtn();
  }

  async changePass(email){
    try {
      await this.autsvc.resetPassword(email);
      console.log('Email ->', email);
      this.presentToast('Correo enviado, verifique en su bandeja de correos no deseados');
      email.value = '';
      this.presentToast('Se envio un corre para el camvio de contraseña');
    } catch (error) {
      console.log('Error -> ', error);
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }
}
