import { Component, OnInit } from '@angular/core';
import { GoogleBooksService } from '../../service/googleBooks/google-books.service';
import { Book } from '../../shared/book.interface';
import { Observable } from 'rxjs';
import { EStore } from '@fireflysemantics/slice';
import { SharedService } from 'src/app/shared/shared.service';
import { Subscription } from 'rxjs';
import { query } from 'firebase/database';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit{

  showCategories: boolean;

  //search data
  bookStore: EStore<Book> = new EStore<Book>();
  books$ = this.bookStore.observe();
  query$ = this.bookStore.observeQuery();
  clickEventsubscription: Subscription;

  //Cientificos books
  terrorBooksStore: EStore<Book> = new EStore<Book>();
  terrorBooks$ = this.terrorBooksStore.observe();
  terrorQuery$ = this.terrorBooksStore.observeQuery();

  //Libros de aventura
   aventuraBooksStore: EStore<Book> = new EStore<Book>();
   aventuraBooks$ = this.aventuraBooksStore.observe();
   aventuraQuery$ = this.aventuraBooksStore.observeQuery();

   //Libros romanticos
   romanticosBooksStore: EStore<Book> = new EStore<Book>();
   romanticosBooks$ = this.romanticosBooksStore.observe();
   romanticosQuery$ = this.romanticosBooksStore.observeQuery();

   //Libros de ficción
   ficcionBooksStore: EStore<Book> = new EStore<Book>();
   ficcionBooks$ = this.ficcionBooksStore.observe();
   ficcionQuery$ = this.ficcionBooksStore.observeQuery();

   //Search filter
   searchFilterValue: string;
   pFilter: string;

  constructor(private gBooks: GoogleBooksService, private sharedService: SharedService) {

    this.clickEventsubscription=  this.sharedService.getClickEvent().subscribe((res)=>{
      this.search(res);
    });

  }

  ngOnInit(): void {
    this.showCategories = true;
    this.searchTerror();
    this.searchAventura();
    this.searchRomanticos();
    this.searchFiccion();
    this.searchFilterValue = 'General';
    this.pFilter = '';
  }

  screenUser() {
    const option = {
      // initialSlide: 0,
      speed: 300,
      slidesPerView: 1,
      loop: true,
      autoplay: false
    };

    if(screen.width >= 1450){
      option.slidesPerView = 6;
    } else if(screen.width < 1450 && screen.width >= 1024) {
      option.slidesPerView = 4;
      option.autoplay = true;
    } else if(screen.width < 1024 && screen.width >= 750){
      option.slidesPerView = 3;
      option.autoplay = true;
    } else if(screen.width < 750){
      option.slidesPerView = 2;
      option.autoplay = true;
    }
    return option;
  }

  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }


  // eslint-disable-next-line @typescript-eslint/no-shadow
  async search(query: string) {
    if(query === ''){
      this.bookStore.reset();
      this.bookStore.postA([]);
      this.showCategories = true;
      return;
    }
    this.showCategories = false;
    const obsrBook: Observable<Book[]> = this.gBooks.search(query, this.pFilter);
    const books: Book[] = await obsrBook.toPromise();
    for(let i = books.length - 1; i>0; i--){
      if(!(books[i].volumeInfo.title && books[i].volumeInfo.imageLinks)){
        books.splice(i);
      }
    }
    this.bookStore.reset();
    this.bookStore.postA(books);
  }

  async searchTerror() {
    const obsrBooksTerror = this.gBooks.searchCategoriesBooks('terror');
    const terrorBooks: Book[] = await obsrBooksTerror.toPromise();
    this.terrorBooksStore.reset();
    this.terrorBooksStore.postA(terrorBooks);
  }

  async searchAventura() {
    const obsrBooksAventura = this.gBooks.searchCategoriesBooks('aventura');
    const aventuraBooks: Book[] = await obsrBooksAventura.toPromise();
    this.aventuraBooksStore.reset();
    this.aventuraBooksStore.postA(aventuraBooks);
  }

  async searchRomanticos() {
    const obsrBooksRomanticos = this.gBooks.searchCategoriesBooks('romanticos');
    const romanticosBooks: Book[] = await obsrBooksRomanticos.toPromise();
    this.romanticosBooksStore.reset();
    this.romanticosBooksStore.postA(romanticosBooks);
  }

  async searchFiccion() {
    const obsrBooksFiccion = this.gBooks.searchCategoriesBooks('ficcion');
    const ficcionBooks: Book[] = await obsrBooksFiccion.toPromise();
    this.ficcionBooksStore.reset();
    this.ficcionBooksStore.postA(ficcionBooks);
  }

  searchFilter(){
    if(this.searchFilterValue === 'General'){
      this.searchFilterValue = 'Título';
      this.pFilter = 'intitle';
      return;
    }
    if(this.searchFilterValue === 'Título'){
      this.searchFilterValue = 'Autor';
      this.pFilter = 'inauthor';
      return;
    }
    if(this.searchFilterValue === 'Autor'){
      this.searchFilterValue = 'Categorías';
      this.pFilter = 'subject';
      return;
    }
    if(this.searchFilterValue === 'Categorías'){
      this.searchFilterValue = 'General';
      this.pFilter = '';
      return;
    }
  }

  titleFilter(){
    const btn = document.querySelector('#titlebtn');
    const btn2 = document.querySelector('#authorbtn');
    const btn3 = document.querySelector('#categorybtn');

   if(btn.classList.contains('selected')){
      btn.classList.remove('selected');
      this.pFilter = '';
   } else {
    this.pFilter = 'intitle';
    btn.classList.add('selected');
    btn2.classList.remove('selected');
    btn3.classList.remove('selected');
   }
   return;
  }
  authorFilter(){
    const btn = document.querySelector('#titlebtn');
    const btn2 = document.querySelector('#authorbtn');
    const btn3 = document.querySelector('#categorybtn');

    if(btn2.classList.contains('selected')){
      btn2.classList.remove('selected');
      this.pFilter = '';
    }else{
      this.pFilter = 'inauthor';
      btn.classList.remove('selected');
      btn2.classList.add('selected');
      btn3.classList.remove('selected');
    }
    return;
  }
  categoryFilter(){
    const btn = document.querySelector('#titlebtn');
    const btn2 = document.querySelector('#authorbtn');
    const btn3 = document.querySelector('#categorybtn');

    if(btn3.classList.contains('selected')){
      btn3.classList.remove('selected');
      this.pFilter = '';
    }else{
      this.pFilter = 'subject';
      btn.classList.remove('selected');
      btn2.classList.remove('selected');
      btn3.classList.add('selected');
    }
    return;
  }

}
