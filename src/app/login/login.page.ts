import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { ModalLoginComponent } from '../components/modal-login/modal-login.component';
import { AuthService } from '../service/AuthFirebase/auth.service';
import { BooksInfoService } from '../service/BooksInfo/books-info.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  showPassword = false;
  typePass = 'password';
  optionSelected: string;
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  userView: boolean = true;
  adminView: boolean;

  user: any={ };

  constructor(private router: Router,
    private authSvc: AuthService,
    private toastController: ToastController,
    public modalController: ModalController,
    public booksService: BooksInfoService,
    ){}

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
  }
  goWelcome(){
    this.router.navigate(['welcome']);
  }

  goHome(){
    this.router.navigate(['tabs/home']);
  }

  goRegister(){
    this.router.navigate(['register']);
  }

  ngOnInit() {
  }

  //Guardar tipo de usuario seleccionado
  userType(event: Event){
      this.optionSelected =  (event as CustomEvent).detail.value;
      console.log((event as CustomEvent).detail.value);
      console.log(this.optionSelected);

      if(this.optionSelected === 'user'){
        this.userView = true;
        this.adminView = false;
      }

      if(this.optionSelected === 'admin'){
        this.userView = false;
        this.adminView = true;
      }
  }



  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1000
    });
    toast.present();
  }

  async onLogin(){
    try {
      const user = await this.authSvc.login(this.user.email, this.user.password);
      if(user){
      //Verificar el mail
        const isVerified = this.authSvc.isEmailVerified(user);
        this.redirectUser(isVerified);
        this.user.email = '';
        this.user.password = '';
      }
      else{
        this.presentToast('Verifique el usuario o contraseña');
      }
    } catch (error) {
      this.presentToast('Ha ocurrido un error');
      console.log('Error', error);
    }
  }
  //async onLoginGoogle(){
    //try {
      //const user = await this.authSvc.loginGoogle();
      //if(user){
        //console.log('User', user);
        //Verificar el email
      //}
    //} catch (error) {
      //console.log('Errorr', error);
    //}
  //}

  async openModal() {
    const modal = await this.modalController.create({
      component: ModalLoginComponent
    });
    return await modal.present();
  }

  /*
  async openModal() {
    const modal = await this.modalController.create({
      component: ModalBookAdminComponent
    });
    return await modal.present();
  }

  */
  private redirectUser(isVerified: boolean){
    ///redirect -> homepage
    if(isVerified){
       this.presentToast('Bienvenido a Biblioloft');
        this.router.navigate(['tabs/home']);
    } else{
       this.presentToast('Revisa tu email para verificar la cuenta');
    }
  }
}
