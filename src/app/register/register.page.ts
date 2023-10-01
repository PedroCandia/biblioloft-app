import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { AuthService } from '../service/AuthFirebase/auth.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { getDatabase, ref, set } from 'firebase/database';
import { ModalVerifyAccountComponent } from '../components/modal-verify-account/modal-verify-account.component';
import { text } from '@fortawesome/fontawesome-svg-core';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  showPassword = false;
  showConfPassword = false;
  user: any ={
  };

  typePass = 'password';
  typeConf = 'password';
  constructor(
    private router: Router,
    private autsvc: AuthService,
    private toastController: ToastController,
    private afDB: AngularFireDatabase,
    public modalController: ModalController) { }

  toggleShow(typeInputPassword) {
    if(typeInputPassword){
      this.showPassword =! this.showPassword;
      if (this.showPassword){
        this.typePass = 'text';
      }
      else {
        this.typePass = 'password';
      }
    }
    else{
      this.showConfPassword =! this.showConfPassword;
      if (this.showConfPassword){
        this.typeConf = 'text';
      }
      else {
        this.typeConf = 'password';
      }
    }
  }

  goLogin(){
    this.router.navigate(['login']);
  }

  ngOnInit() {
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1000
    });
    toast.present();
  }

  async onRegister(){
    if (this.user.confpass === this.user.pass){
      if(this.user.pass.length > 5){
        if(this.user.name !== undefined){
          try {
            const user = await this.autsvc.register(this.user.email, this.user.pass);
            if(user){
              const db = getDatabase();
              set(ref(db, 'users/' + user.uid), {
                nombre: this.user.name,
                email: this.user.email,
                achievActual: 'https://cdn.discordapp.com/attachments/522699340771360773/971107969901166612/Logro.png'
              })
              // this.afDB.object('Usuarios/' + user.uid).set({
              //   nombre: this.user.nombre,
              //   email: this.user.email,
              //   password: this.user.password,
             // })
              .then(()=>{
                this.presentToast('Usuario registrado');
                console.log('Abrir modal para verificacion');
                this.openModal();
                console.log('User', user);
                this.user.name = '';
                this.user.email = '';
                this.user.pass = '';
                this.user.confpass = '';
              });
              set(ref(db, 'users/' + user.uid +'/achievements/achievement1'), {
                id: 'achievement 1',
                url: 'https://cdn.discordapp.com/attachments/522699340771360773/971107969901166612/Logro.png',
                title: 'Bienvenido a Biblioloft!',
                description: 'Crea tu cuenta de Biblioloft'
              });
            }
            else{
              this.presentToast('El correo electronico debe ser verificable');
            }
          } catch (error) {
            console.log('Error', error);
          }
        }
        else{
          this.presentToast('El nombre de usuario no puede estar vacio');
        }
      }
      else{
        this.presentToast('La contraseña debe ser mayor a 5 caracteres');
      }
    }
    else{
      this.presentToast('Las contraseñas no coinciden');
    }
  }


  async openModal() {
    const modal = await this.modalController.create({
      component: ModalVerifyAccountComponent
    });
    return await modal.present();
  }
}
