import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WeatherService } from 'src/app/services/weather.service';
import { CityService } from 'src/app/shared/city.service';

@Component({
  selector: 'app-hourly-weather',
  templateUrl: './hourly-weather.component.html',
  styleUrls: ['./hourly-weather.component.scss']
})
export class HourlyWeatherComponent implements OnInit, OnDestroy {
  hourlyWeather: any[] = [];
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
      this.getHourlyWeather();
    });
  }

  getHourlyWeather(): void {
    // For now, we'll use the current weather service
    // You may need to extend the weather service to include hourly forecasts
    this.weatherService.currentWeather(this.city).subscribe(
      data => {
        // Mock hourly data for demonstration
        // In a real app, you'd get this from an hourly forecast API
        this.hourlyWeather = this.generateMockHourlyData(data);
        this.setWeatherTheme();
      },
      error => {
        console.error('Error fetching hourly weather:', error);
      }
    );
  }

  generateMockHourlyData(currentWeather: any): any[] {
    const hourlyData = [];
    const currentTemp = currentWeather.current.temp_c;
    const currentCondition = currentWeather.current.condition.text;
    
    for (let i = 0; i < 24; i++) {
      const hour = new Date();
      hour.setHours(hour.getHours() + i);
      
      // Generate realistic temperature variations
      const tempVariation = (Math.random() - 0.5) * 6; // ±3°C variation
      const temp = Math.round(currentTemp + tempVariation);
      
      hourlyData.push({
        time: hour,
        temp_c: temp,
        condition: {
          text: currentCondition,
          icon: currentWeather.current.condition.icon
        },
        humidity: Math.round(currentWeather.current.humidity + (Math.random() - 0.5) * 10),
        wind_kph: Math.round(currentWeather.current.wind_kph + (Math.random() - 0.5) * 5)
      });
    }
    
    return hourlyData;
  }

  setWeatherTheme(): void {
    if (this.hourlyWeather.length > 0) {
      const condition = this.hourlyWeather[0].condition.text.toLowerCase();
      
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
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      hour12: true 
    });
  }

  getTimePeriod(date: Date): string {
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return 'AM';
    if (hour >= 12 && hour < 17) return 'PM';
    if (hour >= 17 && hour < 21) return 'EVE';
    return 'NIGHT';
  }

  isCurrentHour(date: Date): boolean {
    const now = new Date();
    return date.getHours() === now.getHours() && 
           date.getDate() === now.getDate();
  }

  trackByHour(index: number, hour: any): number {
    return hour.time.getTime();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
} 