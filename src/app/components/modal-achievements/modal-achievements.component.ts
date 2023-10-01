import { Component, OnInit } from '@angular/core';
import { getDatabase, onValue, ref, update} from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-modal-achievements',
  templateUrl: './modal-achievements.component.html',
  styleUrls: ['./modal-achievements.component.scss'],
})
export class ModalAchievementsComponent implements OnInit {

  uid;

  achievArray: Array<any>;
  noAchiev = false;

  constructor(
    public atrCtrl: AlertController,
    public angularFireAuth: AngularFireAuth,
    private toastController: ToastController,
    private modalController: ModalController,
  ) { }

  async ngOnInit() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        if(uid){
          this.uid = uid;
          this.getAchievements(this.uid);
        }
      }
    });
  }

  getAchievements(userID){
    const db = getDatabase();
    const usersRef = ref(db, `users/${userID}/achievements`);
    onValue(usersRef, (snapshot) => {
      this.achievArray = [];
      this.achievArray = snapshot.val();
      console.log(this.achievArray);
      // Object.keys(this.achievArray).forEach(async (el) =>{
      //   this.achievements.push(el);
      // });
      // console.log(this.achievements);
    });
  }

  async showAlert(id, url){
    const alertConfirm = this.atrCtrl.create({
      message: 'Cambiar logro a ' + id,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: async (): Promise<void> => {
            const db = getDatabase();
            update(ref(db, `users/${this.uid}`), {
              achievActual: url
            });
            this.presentToast('Logro cambiado');
            this.dismissModal();
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

  dismissModal() {
    this.modalController.dismiss();
  }
}
