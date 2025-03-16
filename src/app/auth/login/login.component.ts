import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';  // Necesario para ngModel
import { Router } from '@angular/router';  // Importamos Router
import { CommonModule } from '@angular/common';  // Necesario para usar *ngIf
import { HttpClientModule } from '@angular/common/http';  // Necesario para las peticiones HTTP

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],  // Asegúrate de importar FormsModule, CommonModule y HttpClientModule aquí
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    public authService: AuthService,
    private router: Router // Inyectamos Router
  ) {}

  // Lógica de login
  onLogin() {
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        if (response.token) {
          this.authService.saveToken(response.token);  // Guarda el token en el servicio
          alert('Login exitoso');
          this.router.navigate(['/frontend']); // Redirige al frontend después del login
        }
      },
      (error) => {
        alert('Error en el login');
      }
    );
  }
}
