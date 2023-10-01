import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-libros-admin',
  templateUrl: './libros-admin.page.html',
  styleUrls: ['./libros-admin.page.scss'],
})
export class AgregarLibrosPage implements OnInit {
  categoryBooks = [
    {
      nameCategory: 'Cientificos',
      link: 'https://cdn.discordapp.com/attachments/907064468436049922/921914315764813885/ic_cientificos_90.png'
    },
    {
      nameCategory: 'Literatura',
      link: 'https://cdn.discordapp.com/attachments/907064468436049922/921914316876304404/ic_literatura_90.png'
    },
    {
      nameCategory: 'Aventura',
      link: 'https://cdn.discordapp.com/attachments/907064468436049922/921914315404091403/ic_aventura_90.png'
    },
    {
      nameCategory: 'Terror',
      link: 'https://cdn.discordapp.com/attachments/907064468436049922/921914318705012787/ic_terror_90.png'
    },
    {
      nameCategory: 'Misterio',
      link: 'https://cdn.discordapp.com/attachments/907064468436049922/921914317161508894/ic_misterio_90.png'
    },
    {
      nameCategory: 'Infantiles',
      link: 'https://cdn.discordapp.com/attachments/907064468436049922/921914316406530090/ic_infantiles_90.png'
    },
    {
      nameCategory: 'Poeticos',
      link: 'https://cdn.discordapp.com/attachments/907064468436049922/921914317673226300/ic_poesia_90.png'
    },
    {
      nameCategory: 'Romanticos',
      link: 'https://cdn.discordapp.com/attachments/907064468436049922/921914318310764564/ic_romance_90.png'
    },
    {
      nameCategory: 'Ficcion',
      link: 'https://cdn.discordapp.com/attachments/907064468436049922/921914316070981683/ic_ficcion_90.png'
    },
  ];

  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }
}
