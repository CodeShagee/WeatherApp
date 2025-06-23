import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WeatherCardComponent } from './features/weather-card/weather-card.component';
import { HttpClientModule } from '@angular/common/http';
import { TopBarComponent } from './features/top-bar/top-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    WeatherCardComponent,
    TopBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
