import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Esto asegura que el servicio esté disponible globalmente
})
export class AuthService {
  private apiUrl = 'http://18.223.180.64:3000/auth'; // URL base del backend, asegúrate de que esté correcta

  constructor(private http: HttpClient) {}

  // Método para hacer login
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password });
  }

  // Método para hacer logout
  logout() {
    localStorage.removeItem('authToken'); // Remueve el token del almacenamiento local
  }

  // Verifica si el usuario está logueado comprobando si existe un token
  isLoggedIn(): boolean {
    return localStorage.getItem('authToken') !== null;
  }

  // Guarda el token JWT en el almacenamiento local
  saveToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  // Obtiene el token JWT desde el almacenamiento local
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}
