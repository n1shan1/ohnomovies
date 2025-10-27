import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
  selector: 'landing',
  imports: [Button, RouterModule],
  standalone: true,
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  constructor(private router: Router) {}

  browse(): void {
    this.router.navigate(['/movies']);
  }
}
