import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { SwPush } from '@angular/service-worker';
import { getDatabase, set, ref, update } from 'firebase/database';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { mergeMapTo } from 'rxjs/operators';
// import firebase from 'firebase/compat/app';
import { BehaviorSubject } from 'rxjs';
import '@firebase/messaging';

@Injectable({
  providedIn: 'root'
})
export class ApiRestService {
  // public url = 'https://www.biblioloft.com/';
  public readonly vapidPublicKey = 'BKJtdKXoCH4VZtkz7Z2Ju7iSwlIKffiBiOEppjwBeneDy5PdjH3u8GqmSOe_TB8A26MNiTsEYOKGuydx-J6zyaA';

  currentMessage = new BehaviorSubject(null);
  constructor(
    private swPush: SwPush,
    private firebaseMessaging: AngularFireMessaging,
  ) { }

  // saveToken = (token) => {
  // return this.htttp.post(`${this.url}/save`,
  //   {
  //     token
  //   });
  // };

  getPermission(uid) {
    this.firebaseMessaging.requestPermission
      .pipe(mergeMapTo(this.firebaseMessaging.tokenChanges))
      .subscribe(
        (token) => {
          // console.log(token);
          this.updateToken(uid, token);
        },
        (error) => { console.error(error); },
      );
  }
  recieveMessage() {
    this.firebaseMessaging.onMessage((payload) => {
      console.log(payload);
      this.currentMessage.next(payload);
    });
  }
  updateToken(uid, token) {
    const db = getDatabase();
    update(ref(db, `users/${uid}`), {
      tokenUser: token
    });
  }
}

//SOLUCION 1 CON SWPUSH
// this.swPush.requestSubscription({
//   serverPublicKey: this.vapidPublicKey
// }).then(sub => {
//   const token = JSON.parse(JSON.stringify(sub));
//   console.log(token);
//   // this.apiRest.saveToken(token).subscribe((res)=>{
//   const db = getDatabase();
//   update(ref(db, `users/${uid}/tokenCreds/`), {
//     tokenEndPoint: token.endpoint,
//     tokenKeysAuth: token.keys.auth,
//     tokenKeysP: token.keys.p256dh
//   });
//   // },(err) => {
//   //   console.log(err);
//   // });
// }).catch(err => console.error(err));

//SOLUCION 2 CON FIREBASEMESSAGING
// this.firebaseMessaging.requestPermission
//   .pipe(mergeMapTo(this.firebaseMessaging.tokenChanges))
//   .subscribe(
//     (token) => { console.log('Permission granted!    Token:', token); },
//     (error) => { console.error(error); },
//   );
// this.firebaseMessaging.messages.subscribe(
//   (message) => {
//     console.log('Message received:', message);
//   },
//   (error) => { console.log('failed to subscribe to firebase messaging'); }
// );
