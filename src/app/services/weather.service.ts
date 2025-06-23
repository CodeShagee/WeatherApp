import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiBaseUrl = environment.apiBaseUrl;
  private apiKey = environment.apiKey;

  constructor(private http: HttpClient) { }

  currentWeather(city: string): Observable<any> {
    const url = `${this.apiBaseUrl}current.json?key=${this.apiKey}&q=${city}`;
    return this.http.get<any>(url);
  }
  forecastWeather(city: string, days: number): Observable<any> {
    const url = `${this.apiBaseUrl}forecast.json?key=${this.apiKey}&q=${city}&days=${days}`;
    return this.http.get<any>(url); 
  }
}
