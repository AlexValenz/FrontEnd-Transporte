import { Component, OnInit } from '@angular/core';
import { TransportService } from '../../service/service-api-transport.service';
import { Router } from '@angular/router';  // Importamos Router para redirigir
import { AuthService } from '../auth/auth.service';  // Importamos el servicio de autenticación desde la ruta correcta
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-frontend',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importa FormsModule para usar ngModel
  templateUrl: './frontend.component.html',
  styleUrls: ['./frontend.component.css'],
})
export class FrontendComponent implements OnInit {
  datosFiltrados: any[] = []; // Almacenará los datos filtrados
  filtros: any = {
    anioInicio: null,
    mesInicio: null,
    anioFin: null,
    mesFin: null,
    transporte: 'todos',
    variable: 'Ingresos por pasaje',
  };

  // Lista de transportes disponibles
  transportes: string[] = [
    'Tren Eléctrico',
    'Macrobús Servicio Alimentador',
    'Mi Transporte Eléctrico',
    'MI Macro Periférico Alimentador',
    'Trolebús',
    'Sistema Integral del Tren Ligero',
    'Mi Macro Periférico Troncal',
    'Macrobús Servicio Troncal',
  ];

  // Lista de variables disponibles
  variables: string[] = [
    'Ingresos por pasaje',
    'Kilómetros recorridos',
    'Longitud de servicio',
    'Pasajeros transportados',
    'Unidades en operación',
  ];

  constructor(
    private transportService: TransportService,
    private router: Router,  // Inyectamos el router para redirigir
    private authService: AuthService  // Inyectamos el servicio de autenticación
  ) {}

  ngOnInit(): void {
    this.cargarTodosLosDatos(); // Llama al método para obtener todos los datos al iniciar el componente
  }

  cargarTodosLosDatos() {
    this.transportService
      .getAll(null, null, null, null, 'todos', 'Ingresos por pasaje')
      .subscribe(
        (data: any[]) => {
          console.log('Respuesta de la API:', data); // Depuración

          // Si la API devuelve un solo objeto, conviértelo en un array
          if (!Array.isArray(data)) {
            data = [data];
          }

          // Transforma los datos para que coincidan con la estructura esperada
          this.datosFiltrados = data.map((item) => ({
            anio: item.anio,
            idMes: item.idMes,
            transporte: item.transporte,
            variable: item.variable,
            valor: item.valor,
          }));

          console.log('Datos transformados:', this.datosFiltrados); // Depuración
        },
        (error: any) => {
          console.error('Error al obtener datos:', error);
        }
      );
  }

  aplicarFiltros() {
    const { anioInicio, mesInicio, anioFin, mesFin, transporte, variable } = this.filtros;

    this.transportService
      .getAll(anioInicio, mesInicio, anioFin, mesFin, transporte, variable)
      .subscribe(
        (data: any[]) => {
          console.log('Respuesta de la API:', data); // Depuración

          // Si la API devuelve un solo objeto, conviértelo en un array
          if (!Array.isArray(data)) {
            data = [data];
          }

          // Transforma los datos para que coincidan con la estructura esperada
          this.datosFiltrados = data.map((item) => ({
            anio: item.anio,
            idMes: item.idMes,
            transporte: item.transporte,
            variable: item.variable,
            valor: item.valor,
          }));

          console.log('Datos transformados:', this.datosFiltrados); // Depuración
        },
        (error: any) => {
          console.error('Error al obtener datos:', error);
        }
      );
  }

  // Lógica de logout
  onLogout() {
    this.authService.logout();  // Elimina el token del localStorage
    this.router.navigate(['/login']);  // Redirige al login
  }
}
