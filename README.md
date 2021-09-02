# SqaImdbMoviesFrontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.0.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Team Collaboration Guideline
- Push to ```master``` is forbidden (!)
- Create a branch based on develop branch
    - ```^feature/[a-zA-Z0-9\-]$```
    - ```^bug/[a-zA-Z0-9\-]$```
    - ```^hotfix/[a-zA-Z0-9\-]$```
- Merge develop branch in your branch
- Create a pull request
- Done

## Documentation

### edit Environment variables 

In /src/environments/environments.ts for production /src/environments/environments.prod.ts

Set the value for apiUrl field.

```javascript
export const environment = {
  apiUrl: '',
  production: false
};
```
### make an api call

To make api calls first extend the base service located in `/src/app/services/base/base.service.ts` into your feature service.

For example here MoviesService extends BaseService.

```javascript
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MovieModel } from 'src/app/models/movie.model';
import { BaseService } from '../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class MoviesService extends BaseService<MovieModel> {

  constructor(protected http: HttpClient) { 
    super(http, 'movies');
  }
}
```

BaseService exposes methods for making CRUD API calls for example to get data we can use `getData` method.

In the components we first need to inject the Service in the constructor, this allowes us to use methods of the Service.

```javascript
import { Component, OnInit } from '@angular/core';
import { MovieModel } from 'src/app/models/movie.model';
import { MoviesService } from 'src/app/services/movies/movies.service';

@Component({
  selector: 'app-search-movies',
  templateUrl: './search-movies.component.html',
  styleUrls: ['./search-movies.component.scss'],
})
export class SearchMoviesComponent implements OnInit {
  movies: MovieModel[];

  constructor(private moviesService: MoviesService) {}

  ngOnInit(): void {}

  searchMovie() {
   
    this.moviesService.getData().subscribe(
      (res) => {
        this.movies = this.movies;
      },
      (err) => {
        // show error if request failed.
      }
    );
    
  }
}
```
### working on new features

When working on a new feature if it is not related to existing features add it as a module under `/src/app/modules/{feature-name}`

As an example navigate to `/src/app/modules/search`.

### lazy loading modules

To lazy load a module we need to add it to the routes array in `/src/app/app-routing.module.ts`

If the module is available only for logged-in users, we add the canActivate property and then add the AuthGuard.

Everything about authentication is located under `/src/app/core/auth`.

```javascript
const routes: Routes = [
 {
    path: '',
    loadChildren: () =>
      import('./modules/search/search.module').then(m => m.SearchModule),
      canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./modules/sign/sign.module').then(m => m.SignModule)
  },
]
```
### using angular material components

In this application we have added angular material components.

To use a specific component we first need to add it to the imports array of MaterialModule.

We also need to export the component so that every other module that imports the MaterialModule can have access to angular material components.

```javascript
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [],
  imports: [
    MatButtonModule,
  ],
  exports: [
    MatButtonModule,
  ]
})
export class MaterialModule { }

```

### shared module (components/pipes/utils)

In the shared module located in `/src/app/shared` we add shared components, pipes, and other modules which need to be share accross the application.

For example to add a `SpinnerComponent` and `MaterialModule` to shared module we need to add it as below:

```javascript
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { SpinnerComponent } from './components/spinner/spinner.component';

@NgModule({
  declarations: [
    SpinnerComponent
  ],
  imports: [CommonModule, MaterialModule],
  exports: [MaterialModule, SpinnerComponent],
})
export class SharedModule {}
```

### core module

In the core module `/src/app/core/core.module.ts` we add necessary components/modules and we add interceptors in the providers array of the module.

We then import the core module to the main app module located in `/src/app/app.module.ts`
