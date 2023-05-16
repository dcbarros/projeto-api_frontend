import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Curso } from '../Models/curso';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  private url:string = "http://localhost:8080/api/courses/";
  
  constructor(private http: HttpClient) { 

  }

  obterCursos():Observable<Curso[]>
  {
    return this.http.get<Curso[]>(this.url);
  }

  obterCursosOrdenados(t:string):Observable<Curso[]>
  {
    return this.http.get<Curso[]>(this.url+"sortBy"+t);
  }

  cadastrarCurso(c:Curso):Observable<Curso>{
    return this.http.post<Curso>(this.url, c)
  }

  editarCurso(c:Curso):Observable<Curso>{
    return this.http.put<Curso>(this.url+`${c.id}`, c);
  }

  removerCurso(id:number):Observable<void>{
    return this.http.delete<void>(this.url+`${id}`)
  }
}
