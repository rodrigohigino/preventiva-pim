import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = '';
  senha = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    if (this.api.isAuthenticated) {
      this.router.navigate(['/dashboard']);
    }
  }

  login() {
    this.api.login(this.email, this.senha).subscribe({
      next: (res: any) => {
        this.api.setToken(res.token);
        this.router.navigate(['/dashboard']);
      },
      error: () => alert('Falha no login')
    });
  }
}
