import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeoCodingService {
  constructor(
    private http: HttpClient
  ) { }
  get(direccion:string){
    return this.http.get<any>(`  https://api.mapbox.com/search/geocode/v6/forward?q=${direccion}&access_token=pk.eyJ1IjoiYnVzY2F0dWJham9uIiwiYSI6ImNsdnVlcm80MjFnZjcyam8wMzk2OXI1d20ifQ.O7Vccg8cH-52DC9WPSWUJw
    `)
  }
  ruta(desde:string, hasta:string){
    return this.http.get<any>(` https://api.mapbox.com/directions/v5/mapbox/walking/${desde};${hasta}?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=pk.eyJ1IjoiYnVzY2F0dWJham9uIiwiYSI6ImNsdnVlcm80MjFnZjcyam8wMzk2OXI1d20ifQ.O7Vccg8cH-52DC9WPSWUJw
    `)
  }
}
