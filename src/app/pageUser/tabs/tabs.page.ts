import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ApiRestService } from 'src/app/service/ApiRest/api-rest.service';
import { BooksInfoService } from 'src/app/service/BooksInfo/books-info.service';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  id;
  message;
  constructor(
    public modalController: ModalController,
    public booksService: BooksInfoService,
    // private msgService: ApiRestService
  ) {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        if (uid) {
          this.getInfo();
        }
      }
    });
  }

  ngOnInit() {
  }

  async getInfo() {
    const uid = await this.booksService.getUid();
    if (uid) {
      this.id = uid;
      // this.subscribeToNotifications(uid);
      // this.msgService.getPermission(uid);
      // this.msgService.recieveMessage();
      // this.message = this.msgService.currentMessage;
    }
    else {
      console.log('error');
    }
  }
}
