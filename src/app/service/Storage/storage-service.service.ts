import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { environment } from 'src/environments/environment';

firebase.initializeApp(environment.firebase);

@Injectable({
  providedIn: 'root'
})
export class StorageserviceService {

  storageRef = firebase.app().storage().ref();
  constructor() { }

  async uploadImage(name: string, imgbase: any){
    try {
      const response = await this.storageRef.child('users/'+name).putString(imgbase,'data_url');
      console.log(response);
      return await response.ref.getDownloadURL();
    } catch (error) {
      console.log('Error ->' , error);
      return null;
    }
  }
}
