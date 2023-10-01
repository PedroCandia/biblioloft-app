import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

//Components
import { ModalLoginComponent } from './components/modal-login/modal-login.component';
import { ModalVerifyAccountComponent } from './components/modal-verify-account/modal-verify-account.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
//import { AngularFireDatabase } from '@angular/fire/compat/database'; AngularFireDatabase

import { HttpClientModule } from '@angular/common/http';
import { ModalModifyProfileComponent } from './components/modal-modify-profile/modal-modify-profile.component';
import { ModalSessionComponent } from './components/modal-session/modal-session.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ModalAchievementsComponent } from './components/modal-achievements/modal-achievements.component';
// import firebase from 'firebase/compat/app';
// firebase.initializeApp(environment.firebase);
@NgModule({
  declarations: [
    AppComponent,
    ModalLoginComponent,
    ModalVerifyAccountComponent,
    ModalModifyProfileComponent,
    ModalSessionComponent,
    ModalAchievementsComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
