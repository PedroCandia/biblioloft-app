import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  // modalSession to session.page
  @Output() disparadorDeDatos: EventEmitter<any> = new EventEmitter();

  constructor() { }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  private subject = new Subject<any>();

  sendClickEvent(query: string){
    this.subject.next(query);
    console.log(this.subject);
  }

  getClickEvent(): Observable<any> {
    return this.subject.asObservable();
  }
}
