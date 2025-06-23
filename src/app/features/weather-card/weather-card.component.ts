import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';
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
  private timeSubscription!: Subscription;
  weatherTheme: string = 'default';
  currentLocalTime: Date = new Date();
  timezone: string = '';

  constructor(private weatherService: WeatherService,
              private cityService: CityService
  ) { }

  ngOnInit(): void {
    this.subscription = this.cityService.city$.subscribe(city => {
      this.city = city;
      this.getCurrentWeather();
    });

    // Update time every second
    this.timeSubscription = interval(1000).subscribe(() => {
      this.updateLocalTime();
    });
  }

  getCurrentWeather(): void {
    this.weatherService.currentWeather(this.city).subscribe(
      data => {
        this.currentWeather = data;
        this.setWeatherTheme();
        this.setTimezone();
        this.updateLocalTime();
      },
      error => {
        console.error('Error fetching current weather:', error);
      }
    );
  }

  setWeatherTheme(): void {
    if (!this.currentWeather?.current?.condition?.text) return;
    
    const condition = this.currentWeather.current.condition.text.toLowerCase();
    
    if (condition.includes('sunny') || condition.includes('clear')) {
      this.weatherTheme = 'sunny';
    } else if (condition.includes('cloudy') || condition.includes('overcast')) {
      this.weatherTheme = 'cloudy';
    } else if (condition.includes('rain') || condition.includes('drizzle')) {
      this.weatherTheme = 'rainy';
    } else if (condition.includes('snow') || condition.includes('sleet')) {
      this.weatherTheme = 'snowy';
    } else if (condition.includes('storm') || condition.includes('thunder')) {
      this.weatherTheme = 'stormy';
    } else {
      this.weatherTheme = 'default';
    }
  }

  setTimezone(): void {
    if (this.currentWeather?.location?.tz_id) {
      this.timezone = this.currentWeather.location.tz_id;
    } else {
      // Fallback to UTC if no timezone is provided
      this.timezone = 'UTC';
    }
  }

  updateLocalTime(): void {
    if (this.currentWeather?.location?.localtime) {
      // Use the localtime from the API
      this.currentLocalTime = new Date(this.currentWeather.location.localtime);
    } else if (this.timezone) {
      // Fallback to timezone calculation if localtime is not available
      try {
        const now = new Date();
        this.currentLocalTime = new Date(now.toLocaleString('en-US', { timeZone: this.timezone }));
      } catch (error) {
        this.currentLocalTime = new Date();
        console.warn('Invalid timezone, using local time:', this.timezone);
      }
    } else {
      this.currentLocalTime = new Date();
    }
  }

  formatLocalTime(): string {
    if (this.currentWeather?.location?.localtime) {
      // Format the localtime from API
      const localTime = new Date(this.currentWeather.location.localtime);
      return localTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } else {
      // Fallback to calculated time
      return this.currentLocalTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: this.timezone || undefined
      });
    }
  }

  formatLocalDate(): string {
    if (this.currentWeather?.location?.localtime) {
      // Format the localtime from API
      const localTime = new Date(this.currentWeather.location.localtime);
      return localTime.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else {
      // Fallback to calculated time
      return this.currentLocalTime.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: this.timezone || undefined
      });
    }
  }

  getTimeOfDay(): string {
    let hour: number;
    
    if (this.currentWeather?.location?.localtime) {
      // Use the localtime from API
      const localTime = new Date(this.currentWeather.location.localtime);
      hour = localTime.getHours();
    } else {
      // Fallback to calculated time
      hour = this.currentLocalTime.getHours();
    }
    
    if (hour >= 5 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 17) return 'Afternoon';
    if (hour >= 17 && hour < 21) return 'Evening';
    return 'Night';
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
  }
}
