import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { FrontendComponent } from './frontend/frontend.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirige la raíz a /login
  { path: 'login', component: LoginComponent },
  { path: 'frontend', component: FrontendComponent },
  { path: '**', redirectTo: 'login' }, // Si la ruta no existe, redirige a login
];