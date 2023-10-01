import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Book } from '../../shared/book.interface';

@Injectable({
  providedIn: 'root'
})
export class GoogleBooksService {
  private apiPath = 'https://www.googleapis.com/books/v1/volumes';
  private maxResults = 'maxResults=25';
  private key = 'AIzaSyB7imKs8KU229W3ITNxNbUdxjEav0j8HBE';
  //private orderBy = 'orderBy=relevance';

  constructor(private http: HttpClient) { }

  search(query: string, filter: string): Observable<Book[]> {
    return this.http
      .get<{ items: Book[] }>(`${this.apiPath}?q=${query}+${filter}&${this.maxResults}&${this.key}`)
      .pipe(map(books => books.items || []));
  }

  searchCategoriesBooks(query: string): Observable<Book[]> {
    return this.http
      .get<{ items: Book[] }>(`${this.apiPath}?q=${query}&${this.maxResults}&${this.key}`)
      .pipe(map(popularBooks => popularBooks.items || []));
  }

  getById(volumeId: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiPath}/${volumeId}`);
  }

  getArrayByID(volumeId: string): Observable<Book[]>{
    return this.http
    .get<{ items: Book[] }>(`${this.apiPath}/${volumeId}`)
    .pipe(map(books => books.items || []));
  }

}
