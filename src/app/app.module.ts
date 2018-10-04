import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DetailComponent } from './detail/detail.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AsteroidFilterPipe } from './pipes/asteroidFilter.pipe';
import { AsteroidResolver } from './services/asteroidResolver';
import { NasaService } from './services/nasa.service';
import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { IAppState, rootReducer } from './store';
import { CounterDirective } from './pipes/counter.directive';
import { DashboardResolver } from './services/dashboardResolver';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, /*resolve: { dashboard: DashboardResolver }*/ },
  { path: 'asteroid/:id', component: DetailComponent, resolve: {asteroid: AsteroidResolver} },
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    DetailComponent,
    AsteroidFilterPipe,
    CounterDirective
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgReduxModule
  ],
  providers: [NasaService, AsteroidResolver, DashboardResolver],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(ngRedux: NgRedux<IAppState>) {
    ngRedux.configureStore(rootReducer, {past: '', future: '', searchItems: '', productsPerPage: 4, currentPage: 1, data: []});
  }
}
