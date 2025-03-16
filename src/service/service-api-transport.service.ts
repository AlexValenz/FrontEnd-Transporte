import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransportService {
  private urlApi = 'http://localhost:3000/data-iieg/filter';

  constructor(private clienteHttp: HttpClient) {}

  getAll(
    anioInicio: number,
    mesInicio: number,
    anioFin: number,
    mesFin: number,
    transporte: string,
    variable: string
  ): Observable<any[]> {
    const params = new HttpParams()
      .set('anioInicio', anioInicio.toString())
      .set('mesInicio', mesInicio.toString())
      .set('anioFin', anioFin.toString())
      .set('mesFin', mesFin.toString())
      .set('transporte', transporte)
      .set('variable', variable);
  
    console.log('Parámetros enviados:', params.toString()); // Depuración
  
    return this.clienteHttp.get<any[]>(this.urlApi, { params });
  }
}