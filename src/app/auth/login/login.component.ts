import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';  // Necesario para ngModel
import { CommonModule } from '@angular/common';  // Necesario para usar *ngIf
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],  // Asegúrate de importar FormsModule y CommonModule aquí
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Si ya está logueado, redirige directamente al frontend
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/frontend']);
    }
  }

  // Lógica de login
  onLogin() {
    // Llama al servicio para hacer login
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        if (response.token) {
          this.authService.saveToken(response.token);  // Guarda el token en el servicio
          alert('Login exitoso');
          this.router.navigate(['/frontend']);  // Redirige al frontend después de login exitoso
        }
      },
      (error) => {
        alert('Error en el login');
      }
    );
  }
}
