import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NasaService } from './nasa.service';
import { NgRedux, select } from '@angular-redux/store';
import {IAppState} from '../store';
import {ADD_INFO} from '../actions';

import { Observable } from 'rxjs';
import { of } from 'rxjs';

@Injectable()
export class DashboardResolver implements Resolve<Observable<any>> {
    futureValue;
    pastValue;
    searchArray;
    searchItems;
    data;
    productsPerPage;
    selectedPage;
    visibleData;

    constructor(
        private nasa: NasaService,
        private ngRedux: NgRedux<IAppState>
    ) {}
    resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Observable<any> {
        let a = this.ngRedux.getState();
        if (a.data.length === 0) {
            let today = new Date();
            this.pastValue = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`; this.futureValue = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()+7}`;
            this.selectedPage = a.currentPage; this.productsPerPage = a.productsPerPage; this.searchItems = a.searchItems;
            this.nasa.getAsteroids(undefined).subscribe(res => {
              let array = [];
              Object.values(res.near_earth_objects).forEach(item => {
                for (let i in item ) {
                  array.push(item[i]);
                }
              });

              this.data = array; this.searchArray = this.data;
              this.visibleData = this.searchArray.slice((this.selectedPage - 1) * this.productsPerPage, (a.currentPage - 1) * this.productsPerPage + this.productsPerPage);
              this.ngRedux.dispatch({ type: ADD_INFO, payload: {past: `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`, future: `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()+7}`, searchItems: this.searchItems, productsPerPage: this.productsPerPage, currentPage: this.selectedPage, data: array}});
          
              
            });

            return of({
              futureValue: this.futureValue,
              pastValue: this.pastValue,
              searchArray: this.searchArray,
              searchItems: this.searchItems,
              data: this.data,
              productsPerPage: this.productsPerPage,
              selectedPage: this.selectedPage,
              visibleData: this.visibleData
            });
          } else {
            this.pastValue = a.past; this.futureValue = a.future;
            this.data = a.data; this.selectedPage = a.currentPage; this.productsPerPage = a.productsPerPage; this.searchItems = a.searchItems;
            this.searchArray = a.data;
            this.visibleData = this.searchArray.slice((a.currentPage - 1) * this.productsPerPage, (a.currentPage - 1) * this.productsPerPage + this.productsPerPage);
          
            return of({
              futureValue: this.futureValue,
              pastValue: this.pastValue,
              searchArray: this.searchArray,
              searchItems: this.searchItems,
              data: this.data,
              productsPerPage: this.productsPerPage,
              selectedPage: this.selectedPage,
              visibleData: this.visibleData
            });
          }
    }
}
