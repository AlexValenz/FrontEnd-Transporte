import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransportService {
  private urlApi = 'http://18.223.180.64:3000/data-iieg/filter';

  constructor(private clienteHttp: HttpClient) {}

  getAll(
    anioInicio: number | null,
    mesInicio: number | null,
    anioFin: number | null,
    mesFin: number | null,
    transporte: string | null,
    variable: string | null
  ): Observable<any[]> {
    let params = new HttpParams();
  
    if (anioInicio !== null) {
      params = params.set('anioInicio', anioInicio.toString());
    }
    if (mesInicio !== null) {
      params = params.set('mesInicio', mesInicio.toString());
    }
    if (anioFin !== null) {
      params = params.set('anioFin', anioFin.toString());
    }
    if (mesFin !== null) {
      params = params.set('mesFin', mesFin.toString());
    }
    if (transporte !== null && transporte !== 'todos') {
      params = params.set('transporte', transporte);
    }
    if (variable !== null) {
      params = params.set('variable', variable);
    }
  
    console.log('Parámetros enviados:', params.toString()); // Depuración
  
    return this.clienteHttp.get<any[]>(this.urlApi, { params });
  }
}