import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NavigationExtras, Router } from '@angular/router';
import { ApiDjangoService } from 'src/app/services/api-django.service';
import { EventosService } from 'src/app/services/eventos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {
  datosUsuario:any;
  paginaAnterior:any;
  lstFavoritos:any[]=[];
  misFavoritos:any[]=[];
  lstLocales:any[]=[];

  localesFiltrados: MatTableDataSource<any> = new MatTableDataSource();

  columnasDesplegadas: string[] = ['imagen', 'nombre', 'navegar', 'quitar favorito'];

  constructor(
    private router: Router,
    private api: ApiDjangoService,
    private eventos:EventosService,
  ) { }

  ionViewWillEnter(){
    this.getFavoritos();
  }

  ngOnInit() {
    this.datosUsuario = JSON.parse(localStorage.getItem('usuarioActivo') || '{}');
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state) {
       this.paginaAnterior = state['paginaAnterior']
    }
    this.getFavoritos();

  }

  backBtn(){
    this.router.navigate([this.paginaAnterior])
  }

  getFavoritos(){
    this.api.get(`Favorito/`).subscribe((r:any)=>{
      this.lstFavoritos = r

      this.misFavoritos = this.lstFavoritos.filter(fav=> fav.usuario == this.datosUsuario.id);

      this.api.get(`Locales/`).subscribe((r:any)=>{
        this.lstLocales = r
        const localesFiltrados = this.lstLocales.filter(local => 
          this.misFavoritos.some(favorito => favorito.local === local.id)
        );
        this.localesFiltrados.data = localesFiltrados;
      });
    })
  }

  detalle(item:any){

    const navigationExtras: NavigationExtras = {
      state: {
        item: item,
        paginaAnterior:'favoritos'
      }
    };
    this.router.navigate(['detalle-local'], navigationExtras);
  }

  marcarRuta(item:any){
    const navigationExtras: NavigationExtras = {
      state: {
        item: item,
        paginaAnterior:'favoritos'
      }
    };

    this.router.navigate(['tabs/tab1'], navigationExtras);
    this.eventos.marcarRuta.emit(true);
  }

  eliminar(local:any){
    let favorito = this.misFavoritos.find(favorito => favorito.local === local.id); 
    this.api.delete(`Favorito/`, favorito.id).subscribe((r:any)=>{
      this.getFavoritos();
      Swal.fire({
        toast: true,
        title: "Favorito Eliminado!",
        icon: "error",
        timer: 2500,
        showConfirmButton: false,
        position: 'bottom',
        width: '70%',
        //color: '#FFFFFF',
        //background: '#00000090',
      });
    });
  }

  handleRefresh(event:any) {
    setTimeout(() => { 
      this.getFavoritos();
      event.target.complete();
    }, 1000);
  }
}