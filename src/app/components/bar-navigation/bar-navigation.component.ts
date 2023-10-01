import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { BooksInfoService } from 'src/app/service/BooksInfo/books-info.service';
import { SharedService } from 'src/app/shared/shared.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


@Component({
  selector: 'app-bar-navigation',
  templateUrl: './bar-navigation.component.html',
  styleUrls: ['./bar-navigation.component.scss'],
})

export class BarNavigationComponent implements OnInit {

  id;
  constructor(private ionic: IonicModule,
    private router: Router,
    public booksService: BooksInfoService,
    private sharedService:
    SharedService) {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const uid = user.uid;
          if(uid){
            this.getInfo();
          }
        }
      });
    }

  ngOnInit() {}

  async getInfo(){
    const uid = await this.booksService.getUid();
    if (uid){
      this.id = uid;
    }
    else{
      console.log('error');
    }
  }

  getValue(event: Event): string {
    // console.log((event.target as HTMLInputElement).value);
    this.router.navigate(['tabs/home']);
    this.sharedService.sendClickEvent ((event.target as HTMLInputElement).value);
    return (event.target as HTMLInputElement).value;
  }

  goHome(){
    this.router.navigate(['tabs/home']);
  }

  goSession(){
    this.router.navigate(['tabs/session']);
  }

  goProfile(){
    this.router.navigate(['tabs/profile/' + this.id]);
  }

  goSettings() {
    this.router.navigate(['tabs/settings']);

  }
}
