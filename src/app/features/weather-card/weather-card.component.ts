import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WeatherService } from 'src/app/services/weather.service';
import { CityService } from 'src/app/shared/city.service';

@Component({
  selector: 'app-weather-card',
  templateUrl: './weather-card.component.html',
  styleUrls: ['./weather-card.component.scss']
})
export class WeatherCardComponent implements OnInit, OnDestroy {
  currentWeather: any;
  city: string = 'London'; // Default city, can be changed based on user input
  private subscription!: Subscription;


  constructor(private weatherService: WeatherService,
              private cityService: CityService
  ) { }

  ngOnInit(): void {
    this.subscription =  this.cityService.city$.subscribe(city => {
      this.city = city;
      this.getCurrentWeather();
    });
  }



  getCurrentWeather(): void {
    this.weatherService.currentWeather(this.city).subscribe(
      data => {
        this.currentWeather = data;
      },
      error => {
        console.error('Error fetching current weather:', error);
      }
    );
  }

  ngOnDestroy(): void {
    this
  }
}
