import { ApplicationConfig } from '@angular/core';
import { provideRouter, Route } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { LoginComponent } from './auth/login/login.component';
import { FrontendComponent } from './frontend/frontend.component';

const routes: Route[] = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },  // Redirige al login por defecto
  { path: 'login', component: LoginComponent },
  { path: 'frontend', component: FrontendComponent }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),  // Habilita el ruteo en la app
    provideHttpClient(),    // Habilita HttpClient en toda la app
  ]
};
