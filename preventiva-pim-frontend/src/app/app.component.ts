import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public api: ApiService, private router: Router) {}

  logout() {
    this.api.logout();
    this.router.navigate(['/login']);
  }
}
