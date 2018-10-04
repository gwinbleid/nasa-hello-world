import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NasaService } from './nasa.service';

import {Observable} from 'rxjs';
import { of } from 'rxjs';

@Injectable()
export class AsteroidResolver implements Resolve<any> {
  constructor(private nasa: NasaService) {}
  resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Observable<any> {
    console.log('Id:  ', route.params['id']);
    return this.nasa.getAsteroid(route.params.id);
  }
}
