import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Movie } from '../../services/movie.service';

@Component({
  selector: 'movie-card',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TagModule],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.css',
})
export class MovieCard {
  @Input() movie!: Movie;

  constructor(private router: Router) {}

  viewDetails(): void {
    this.router.navigate(['/movies', this.movie.id]);
  }

  getDurationDisplay(): string {
    const hours = Math.floor(this.movie.durationInMinutes / 60);
    const minutes = this.movie.durationInMinutes % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }
}
