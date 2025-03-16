import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TransportService } from '../../service/service-api-transport.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';  // Importa los componentes necesarios

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

  // Propiedad para almacenar el gráfico
  chart: any;

  @ViewChild('chartCanvas') chartCanvas!: ElementRef;

  constructor(
    private transportService: TransportService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Registra todos los componentes de Chart.js
    Chart.register(...registerables);
    this.cargarTodosLosDatos(); // Cargar todos los datos desde el inicio para la tabla
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
          console.log('Datos transformados para la tabla:', this.datosFiltrados);
          // No llamamos a crearGrafica aquí
        },
        (error: any) => {
          console.error('Error al obtener datos:', error);
        }
      );
  }

  aplicarFiltros() {
    const { anioInicio, mesInicio, anioFin, mesFin, transporte, variable } = this.filtros;

    this.currentPage = 0; // Restablecer la página actual a la primera

    this.transportService
      .getAll(anioInicio, mesInicio, anioFin, mesFin, transporte, variable)
      .subscribe(
        (data: any[]) => {
          console.log('Respuesta de la API con filtros:', data);
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
          console.log('Datos transformados con filtros:', this.datosFiltrados);
          this.crearGrafica(); // Llamar a la función para crear la gráfica solo después de aplicar los filtros
        },
        (error: any) => {
          console.error('Error al obtener datos con filtros:', error);
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

  crearGrafica() {
    // Generar las etiquetas dinámicamente basadas en los datos
    const labels = [...new Set(this.datosFiltrados.map(item => `${item.anio}-${item.idMes}`))];
    const transportesUnicos = [...new Set(this.datosFiltrados.map(item => item.transporte))];

    console.log('Transportes únicos:', transportesUnicos); // Verifica los transportes únicos

    // Tipado de colores para que sea más seguro
    const colors: { [key: string]: string } = {
      'Tren Eléctrico': 'rgba(255, 99, 132, 0.8)',  // Rosa
      'Trolebús': 'rgba(54, 162, 235, 0.8)',  // Azul
      'Mi Transporte Eléctrico': 'rgba(255, 159, 64, 0.8)',  // Naranja
      'Macrobús Servicio Alimentador': 'rgba(75, 192, 192, 0.8)',  // Verde
      'Sistema Integral del Tren Ligero': 'rgba(153, 102, 255, 0.8)',  // Morado
      'Mi Macro Periférico Troncal': 'rgba(255, 205, 86, 0.8)',  // Amarillo
      'Macrobús Servicio Troncal': 'rgba(255, 99, 71, 0.8)',  // Rojo anaranjado
      'MI Macro Periférico Alimentador': 'rgba(54, 162, 35, 0.8)'  // Verde oscuro
    };

    // Datos por transporte
    const datasets = transportesUnicos.map((transporte) => {
      const datosTransporte = this.datosFiltrados.filter(item => item.transporte === transporte);
      const data = labels.map((label) => {
        const item = datosTransporte.find(i => `${i.anio}-${i.idMes}` === label);
        return item ? item.valor : 0;  // Si no hay valor para esa fecha, asigna 0
      });

      return {
        label: transporte,
        data: data,
        backgroundColor: colors[transporte] || 'rgba(0,0,0,0.2)',
        borderColor: colors[transporte] || 'rgba(0,0,0,1)',
        borderWidth: 1
      };
    });

    // Si ya existe un gráfico, lo destruye antes de crear uno nuevo
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'bar', // Tipo de gráfico
      data: {
        labels: labels, // Etiquetas de las fechas
        datasets: datasets // Los datos por transporte
      },
      options: {
        responsive: true,
        scales: {
          x: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
