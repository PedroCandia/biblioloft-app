import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class BooksInfoService {

  // usersRef: AngularFireList<any>;

  constructor(
    private db: AngularFireDatabase,
    public angularFireAuth: AngularFireAuth
    ) { }

  getFavBooks(userID): AngularFireList<any>{
    return this.db.list(`users/${userID}/favBooks`) as AngularFireList<any>;
  }

  async getUid(){
    const user = await this.angularFireAuth.currentUser;
    if (user){
      return user.uid;
    }
    return null;
  }
}
