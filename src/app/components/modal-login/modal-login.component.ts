import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/service/AuthFirebase/auth.service';

@Component({
  selector: 'app-modal-login',
  templateUrl: './modal-login.component.html',
  styleUrls: ['./modal-login.component.scss'],
})
export class ModalLoginComponent implements OnInit {

  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private autsvc: AuthService) { }

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
  ngOnInit() {}
  async forgotPass(email){
    try {
      await this.autsvc.resetPassword(email.value);
      console.log('Email ->', email.value);
      this.modalController.dismiss();
      this.presentToast('Correo enviado, verifique en su bandeja de correos no deseados');
      email.value = '';
    } catch (error) {
      console.log('Error -> ', error);
    }
  }
}
