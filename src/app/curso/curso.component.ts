import { Component, OnInit } from '@angular/core';
import { Curso } from '../Models/curso';
import { CursoService } from './curso.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-curso',
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.css']
})
export class CursoComponent implements OnInit {

  tabela:boolean = true;
  btnVisible: boolean = true;
  sort:boolean = false;

  cursos: Curso[] = [];
  curso = new Curso();

  constructor(
    private _cursoService:CursoService,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
      this.selecao();
  }

  // Cadastro
  cadastro():void{
    this._cursoService.cadastrarCurso(this.curso)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        this._snackBar.open(`${error.error.messages}`, "OK", {duration: 3000});
        return new Observable<never>(() => {
          throw new Error('Ocorreu um erro ao cadastrar o curso');
        });
      })
    )
    .subscribe(
      res => {
        this.cursos.push(res);
        this._snackBar.open("Cadastro Efetuado com sucesso", "OK", {duration: 3000});
        this.curso = new Curso();
        this.selecao();
      }
    );
  }
  // Seleção
  selecao(): void{
    this._cursoService.obterCursos().subscribe(
      res => {
        this.cursos = res;
      }
    );
  }

  sortSelecao(t:string):void{
    if(!this.sort)
    {
      this._cursoService.obterCursosOrdenados(t).subscribe(
        res => {
          this.sort = !this.sort;
          this.cursos = res;
        }
      );
    }
    else
    {
      this._cursoService.obterCursos().subscribe(
        res => {
          this.sort = !this.sort;
          this.cursos = res;
        }
      );
    }

  }

  selecionarCurso(p: number, b:boolean=false): void{
    this.curso = this.cursos[p];
    this.btnVisible = b;
    this.tabela = b;
  }

  // Alterar
  alterar(): void{
    this._cursoService.editarCurso(this.curso)
    .subscribe(
      res => {
        let index = this.cursos.findIndex(c => {return c.id == res.id});
        this.cursos[index] = res
        this.cursos.push(res);
        this._snackBar.open("Alteração realizada com sucesso", "OK", {duration: 3000});
        
        this.curso = new Curso();
        this.btnVisible = true;
        this.tabela = true;
      }
    );
  }

  voltar(){
    this.btnVisible = true;
    this.tabela = true;
    this.curso = new Curso();
  }
  // Remover
  remover(p:number): void{

    this.selecionarCurso(p,true);
    this._cursoService.removerCurso(this.curso.id)
    .subscribe(
      res => {
        let index = this.cursos.findIndex(c => {return c.id == this.curso.id});
        this.cursos.splice(index,1);
        this._snackBar.open("Remoção realizada com sucesso", "OK", {duration: 3000});
        
        this.curso = new Curso();
      })
  }
}
