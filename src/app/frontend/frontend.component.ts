import { Component, OnInit } from '@angular/core';
import { TransportService } from '../../service/service-api-transport.service';
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

  constructor(private transportService: TransportService) {}

  ngOnInit(): void {
    this.aplicarFiltros(); // Llama al método para obtener los datos al iniciar el componente
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
}