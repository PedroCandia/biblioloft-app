import { Component } from '@angular/core';
// import { ApiRestService } from './service/ApiRest/api-rest.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  // uid;
  // message;
  constructor(
    // private msgService: ApiRestService,
    ) {
    // const auth = getAuth();
    // onAuthStateChanged(auth, (user) => {
    //   if (user) {
    //     const uid = user.uid;
    //     if(uid){
    //       this.uid = uid;
          // this.msgService.getPermission(this.uid);
          // this.msgService.recieveMessage();
          // this.message = this.msgService.currentMessage;
      //   }
      // }
    // });
  }
}

// export const onMessageCreate = functions.database
// .ref('/users/{userId}/sessions/')
// .onCreate((snapshot, context) => {
// 	const sessions = context.params.sessions;
//   console.log('session ->', sessions);
//   const body = snapshot.val();
//   const payload = {
//     notification: {
//       title: 'nueva sesión de lectura',
//       body: body.ts,
//     }
//   };
//   admin.database().ref('users/{userID}/tokenUser').once('value').then(token => token.val() ).then(userFCMToken => {
//     admin.messaging().sendToDevice(userFCMToken, payload);
//   }).then(res => {
//     console.log(res);
//   })
//   .catch(err => {
//     console.log(err);
//   });
// });
// }
