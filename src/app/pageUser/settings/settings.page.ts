import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { ModalModifyProfileComponent } from 'src/app/components/modal-modify-profile/modal-modify-profile.component';
import { AuthService } from 'src/app/service/AuthFirebase/auth.service';
import { getDatabase, ref, update, get, remove, set } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  uid;
  achievAct;
  constructor(
    private router: Router,
    private autsvc: AuthService,
    private toastController: ToastController,
    private modalController: ModalController,
    public atrCtrl: AlertController,
  ) { }

  ngOnInit() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.uid = user.uid;
        this.checkAchiev();
      }
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1000
    });
    toast.present();
  }

  onLogOff(){
    try {
      this.autsvc.logout();
      this.router.navigate(['login']);
      this.presentToast('Cerrando sesión...');
    } catch (error) {
      console.log('Error', error);
    }
  }

  checkAchiev(){
    const db = getDatabase();
    const dbRef = ref(db, `users/${this.uid}/achievActual`);
    get(dbRef).then((snapshot) =>{
      if(snapshot.val()){
        this.achievAct = true;
      }
      else{
        this.achievAct = false;
      }
    });
  }

  async activateAchiev(){
    if (this.achievAct === true) {
      const db = getDatabase();
      update(ref(db, `users/${this.uid}`), {
        achievActual: 'https://cdn.discordapp.com/attachments/522699340771360773/971107969901166612/Logro.png'
      });
      this.presentToast('Logros activados');
    } else {
      const db = getDatabase();
      update(ref(db, `users/${this.uid}`), {
        achievActual: ''
      });
      // remove(ref(db, `users/${this.uid}/achievActual`));
      this.presentToast('Logros desactivados');
    }
  }

  async openModalModify() {
    const modal = await this.modalController.create({
      component: ModalModifyProfileComponent
    });
    return await modal.present();
  }
}

