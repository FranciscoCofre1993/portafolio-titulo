import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiDjangoService {
  url = "https://buscatubajon.pythonanywhere.com/api"
  constructor(
    private http: HttpClient
  ) { }

  get(ruta:string){
    return this.http.get<any>(this.url+`/${ruta}/`)
  }

  post(ruta:string, data:any){
    return this.http.post(this.url+`/${ruta}/`, data)
  }

  update(ruta: string, id: number, data: any): Observable<any> {
    return this.http.put(this.url + `/${ruta}/${id}/`, data);
  }

  delete(ruta: string, id: number): Observable<any> {
    return this.http.delete(this.url + `/${ruta}/${id}/`);
  }

}
