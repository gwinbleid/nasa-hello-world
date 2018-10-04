import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NasaService {
  api_key = 'jCK2doPGNBxpSigpjoDy2JPKLTchA5UWeEsH22Wb';


  constructor(private http: HttpClient) { }

  getAsteroids(obj) {
    if (!obj) {
      return this.http.get<any>(`https://api.nasa.gov/neo/rest/v1/feed?start_date=&end_date=&api_key=${this.api_key}`);
    }
    return this.http.get<any>(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${obj.past}&end_date=${obj.future}&api_key=${this.api_key}`);
  }

  getAsteroid(id) {
    return  this.http.get<any>(`https://api.nasa.gov/neo/rest/v1/neo/${id}?api_key=${this.api_key}`);
  }
}
