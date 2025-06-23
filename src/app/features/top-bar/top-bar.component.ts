import { Component, EventEmitter, Output } from '@angular/core';
import { CityService } from "src/app/shared/city.service"; 

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent {
 constructor(private cityService: CityService) { }

  onSearch(cityInput: HTMLInputElement): void {
    const cityName = cityInput.value.trim();
    if (cityName) {
      this.cityService.selectCity(cityName);
    }
  }
}
