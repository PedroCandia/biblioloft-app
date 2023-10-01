import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/AuthFirebase/auth.service';

@Component({
  selector: 'app-settings-admin',
  templateUrl: './settings-admin.page.html',
  styleUrls: ['./settings-admin.page.scss'],
})
export class SettingsAdminPage implements OnInit {

  constructor(private router: Router, private autsvc: AuthService) { }

  ngOnInit() {
  }

  onLogOff(){
    try {
      this.autsvc.logout();
      this.router.navigate(['login']);
    } catch (error) {
      console.log('Error', error);
    }
  }
}
