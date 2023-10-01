import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-verify-account',
  templateUrl: './modal-verify-account.component.html',
  styleUrls: ['./modal-verify-account.component.scss'],
})
export class ModalVerifyAccountComponent implements OnInit {

  constructor(private router: Router, private modalController: ModalController) { }

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss();
    this.router.navigate(['login']);
  }
}

