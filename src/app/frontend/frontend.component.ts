import { Component, OnInit } from '@angular/core';
import { TransportService } from '../../service/service-api-transport.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-frontend',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  // Rango de años (1997 - 2023)
  anios: number[] = Array.from({ length: 2023 - 1997 + 1 }, (_, i) => 1997 + i);

  // Rango de meses (1 a 12)
  meses: number[] = Array.from({ length: 12 }, (_, i) => i + 1);

  // Propiedades para la paginación
  currentPage: number = 0;
  pageSize: number = 20;

  constructor(
    private transportService: TransportService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarTodosLosDatos();
  }

  cargarTodosLosDatos() {
    this.transportService
      .getAll(null, null, null, null, 'todos', 'Ingresos por pasaje')
      .subscribe(
        (data: any[]) => {
          console.log('Respuesta de la API:', data);
          if (!Array.isArray(data)) {
            data = [data];
          }

          this.datosFiltrados = data.map((item) => ({
            anio: item.anio,
            idMes: item.idMes,
            transporte: item.transporte,
            variable: item.variable,
            valor: item.valor,
          }));
          console.log('Datos transformados:', this.datosFiltrados);
        },
        (error: any) => {
          console.error('Error al obtener datos:', error);
        }
      );
  }

  aplicarFiltros() {
    const { anioInicio, mesInicio, anioFin, mesFin, transporte, variable } = this.filtros;

    this.currentPage = 0;

    this.transportService
      .getAll(anioInicio, mesInicio, anioFin, mesFin, transporte, variable)
      .subscribe(
        (data: any[]) => {
          console.log('Respuesta de la API:', data);
          if (!Array.isArray(data)) {
            data = [data];
          }

          this.datosFiltrados = data.map((item) => ({
            anio: item.anio,
            idMes: item.idMes,
            transporte: item.transporte,
            variable: item.variable,
            valor: item.valor,
          }));
          console.log('Datos transformados:', this.datosFiltrados);
        },
        (error: any) => {
          console.error('Error al obtener datos:', error);
        }
      );
  }

  resetFiltros() {
    this.filtros = {
      anioInicio: null,
      mesInicio: null,
      anioFin: null,
      mesFin: null,
      transporte: 'todos',
      variable: 'Ingresos por pasaje',
    };
    this.currentPage = 0;
    
    this.cargarTodosLosDatos(); // Recarga los datos sin filtros
  }

  changePage(direction: number) {
    const newPage = this.currentPage + direction;
    const totalPages = Math.ceil(this.datosFiltrados.length / this.pageSize);

    if (newPage >= 0 && newPage < totalPages) {
      this.currentPage = newPage;
    }
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
