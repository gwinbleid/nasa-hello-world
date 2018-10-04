import { Component, OnInit } from '@angular/core';
import { NasaService } from '../services/nasa.service';
import {FormBuilder, FormGroup, Validators, AbstractControl, FormControl} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgRedux, select } from '@angular-redux/store';
import {IAppState} from '../store';
import {ADD_INFO} from '../actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  futureValue;
  pastValue;
  searchArray = [];
  searchItems = '';
  data = [];
  myForm: FormGroup;
  past: AbstractControl;
  future: AbstractControl;

  public productsPerPage;
  public selectedPage;

  visibleData = [];

  constructor(
    private nasa: NasaService,
    private router: Router,
    private route: ActivatedRoute,
    fb: FormBuilder,
    private ngRedux: NgRedux<IAppState>
  ) {
    this.myForm = fb.group({
      'past': ['', Validators.compose([Validators.required, minDate])],
      'future': ['', Validators.compose([Validators.required, maxDate])]
    }, {validator: [dateComparer, sevenDays]});

    this.past = this.myForm.controls['past'];
    this.future = this.myForm.controls['future'];
  }

  ngOnInit() {
    /*this.route.data.subscribe(value => {
      console.log(value);

      this.data = value.dashboard.data;
      this.pastValue = value.dashboard.pastValue;
      this.futureValue = value.dashboard.futureValue;
      this.searchArray = value.dashboard.searchArray;
      this.productsPerPage = value.dashboard.productsPerPage;
      this.selectedPage = value.dashboard.selectedPage;
      this.visibleData = value.dashboard.visibleData;
      this.searchItems = value.dashboard.searchItems;
    });*/

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
    } else {
      this.pastValue = a.past; this.futureValue = a.future;
      this.data = a.data; this.selectedPage = a.currentPage; this.productsPerPage = a.productsPerPage; this.searchItems = a.searchItems;
      this.searchArray = a.data;
      this.visibleData = this.searchArray.slice((a.currentPage - 1) * this.productsPerPage, (a.currentPage - 1) * this.productsPerPage + this.productsPerPage);
    }
  }

  goToDetails(id) {
    this.router.navigate(['asteroid', id]);
  }

  sendRequest(value) {
    console.log(value);
    this.nasa.getAsteroids(value).subscribe(res => {
      let array = [];
      Object.values(res.near_earth_objects).forEach(item => {
        for (let i in item ) {
          array.push(item[i]);
        }
      });

      this.pastValue = value.past; this.futureValue = value.future; this.searchItems = '';
      this.data = array;
      this.searchArray = this.data;
      this.visibleData = this.searchArray.slice((this.selectedPage - 1) * this.productsPerPage, (this.selectedPage - 1) * this.productsPerPage + this.productsPerPage);
      this.ngRedux.dispatch({ type: ADD_INFO, payload: { past: value.past, future: value.future, searchItems: '', productsPerPage: this.productsPerPage, currentPage: this.selectedPage, data: array}});
      this.myForm.reset();
    });
  }

  changePageSize(newSize: number) {
    this.productsPerPage = Number(newSize);
    this.changePage(1);
    this.visibleData = this.searchArray.slice((this.selectedPage - 1) * this.productsPerPage, this.productsPerPage);
  }

  changePage(newPage: number) {
    this.selectedPage = newPage;
    this.ngRedux.dispatch({ type: ADD_INFO, payload: {past: this.pastValue, future: this.futureValue, searchItems: this.searchItems, productsPerPage: this.productsPerPage, currentPage: this.selectedPage, data: this.data}});
    this.visibleData = this.searchArray.slice((newPage - 1) * this.productsPerPage, (newPage - 1) * this.productsPerPage + this.productsPerPage);
  }

  get pageCount() {
    return Math.ceil(this.searchArray.length / this.productsPerPage);
  }

  search() {
    console.log("event.works");
    this.searchArray = this.data.filter(item => {
      if (String(item.id).includes(this.searchItems) || String(item.name).includes(this.searchItems) || String(item.absolute_magnitude_h).includes(this.searchItems) ) {
        return true;
      }
    });
    this.changePage(1);
    this.ngRedux.dispatch({ type: ADD_INFO, payload: {past: this.pastValue, future: this.futureValue, searchItems: this.searchItems, productsPerPage: this.productsPerPage, currentPage: this.selectedPage, data: this.searchArray}});
  }
}

function minDate(control: FormControl): { [s: string]: boolean } {
  const oldie = new Date('1900-01-01');
  const currently = new Date(control.value);

  if (currently < oldie) {
    return { tooOldTime: true };
  }
}

function maxDate(control: FormControl): { [s: string]: boolean } {
  const future = new Date('2100-12-31');
  const currently = new Date(control.value);

  if (currently > future) {
    return { tooLateTime: true };
  }
}

function dateComparer(group: FormGroup) {
  const past = new Date(group.controls['past'].value);
  const future = new Date(group.controls['future'].value);
  if (past > future) {
    return { wrongDateInfo: true };
  }
}

function sevenDays(group: FormGroup) {
  const past = new Date(group.controls['past'].value);
  const future = new Date(group.controls['future'].value);
  const timeDiff = future.getTime() - past.getTime();
  const diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));

  if (diffDays > 7) {
    return { wrongCountOfDays: true };
  }
}
