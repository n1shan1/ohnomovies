import { Routes } from '@angular/router';

export const MOVIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/movie-list/movie-list').then((m) => m.MovieList),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/movie-details/movie-details').then((m) => m.MovieDetails),
  },
];
