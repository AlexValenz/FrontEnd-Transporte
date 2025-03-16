import { Component } from '@angular/core';
import { FrontendComponent } from './frontend/frontend.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FrontendComponent], // Solo importa componentes
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend-transporte';
}