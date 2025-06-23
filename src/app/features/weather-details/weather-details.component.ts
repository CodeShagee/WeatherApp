import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WeatherService } from 'src/app/services/weather.service';
import { CityService } from 'src/app/shared/city.service';

@Component({
  selector: 'app-weather-details',
  templateUrl: './weather-details.component.html',
  styleUrls: ['./weather-details.component.scss']
})
export class WeatherDetailsComponent implements OnInit, OnDestroy {
  currentWeather: any;
  city: string = 'London';
  private subscription!: Subscription;
  weatherTheme: string = 'default';

  constructor(
    private weatherService: WeatherService,
    private cityService: CityService
  ) { }

  ngOnInit(): void {
    this.subscription = this.cityService.city$.subscribe(city => {
      this.city = city;
      this.getCurrentWeather();
    });
  }

  getCurrentWeather(): void {
    this.weatherService.currentWeather(this.city).subscribe(
      data => {
        this.currentWeather = data;
        this.setWeatherTheme();
      },
      error => {
        console.error('Error fetching weather details:', error);
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

  // Helper methods for formatting values
  formatWindDirection(degree: number): string {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degree / 22.5) % 16;
    return directions[index];
  }

  formatPressure(pressure: number): string {
    return `${pressure} hPa`;
  }

  formatVisibility(km: number): string {
    return `${km} km`;
  }

  formatUV(uv: number): string {
    if (uv <= 2) return 'Low';
    if (uv <= 5) return 'Moderate';
    if (uv <= 7) return 'High';
    if (uv <= 10) return 'Very High';
    return 'Extreme';
  }

  getUVColor(uv: number): string {
    if (uv <= 2) return '#00ff00';
    if (uv <= 5) return '#ffff00';
    if (uv <= 7) return '#ff8000';
    if (uv <= 10) return '#ff0000';
    return '#800080';
  }

  formatDewPoint(temp: number): string {
    return `${temp}°C`;
  }

  formatHeatIndex(temp: number): string {
    return `${temp}°C`;
  }

  formatWindChill(temp: number): string {
    return `${temp}°C`;
  }

  formatPrecipitation(mm: number): string {
    if (mm === 0) return '0 mm';
    return `${mm} mm`;
  }

  formatCloudCover(percentage: number): string {
    return `${percentage}%`;
  }

  isDayTime(): boolean {
    return this.currentWeather?.current?.is_day === 1;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
} 