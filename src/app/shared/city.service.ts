import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CityService {
private citySubject = new BehaviorSubject<string>('Colombo');
  city$ = this.citySubject.asObservable();

  selectCity(city: string): void {
    this.citySubject.next(city);
  }
}
