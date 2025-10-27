import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService, Movie } from '../../services/movie.service';
import { MovieCard } from '../../components/movie-card/movie-card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'movie-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MovieCard,
    InputTextModule,
    ButtonModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.css',
})
export class MovieList implements OnInit {
  movies: Movie[] = [];
  filteredMovies: Movie[] = [];
  searchQuery: string = '';
  isLoading: boolean = false;

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.isLoading = true;

    this.movieService.getAllMovies().subscribe({
      next: (movies) => {
        this.movies = movies;
        this.filteredMovies = movies;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
      },
    });
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.filteredMovies = this.movies;
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredMovies = this.movies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(query) ||
        movie.description.toLowerCase().includes(query) ||
        (movie.language && movie.language.toLowerCase().includes(query))
    );
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredMovies = this.movies;
  }
}
