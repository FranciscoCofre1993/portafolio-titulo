import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { EventosService } from 'src/app/services/eventos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  datosUsuario: any


  constructor(
    private router : Router,
    private eventos:EventosService
  ) {
    eventos.actualizarUsuario.subscribe((r)=>{
      this.recargarUsuario();
    })
  }

  ngOnInit(): void {
    this.datosUsuario = JSON.parse(localStorage.getItem('usuarioActivo') || '{}');
  }
  

  recargarUsuario(){
    this.datosUsuario = JSON.parse(localStorage.getItem('usuarioActivo') || '{}');
  }

  ir(){
    localStorage.clear();
    this.router.navigate(['/login']);

    Swal.fire({
      toast: true,
      title: "Has sido desconectado",
      icon: "info",
      timer: 2500,
      showConfirmButton: false,
      position: 'bottom',
      width: '80%',
      color: '#FFFFFF',
      background: '#000000',
    });
  }

  registrar(){
    localStorage.clear();
    const navigationExtras: NavigationExtras = {
      state: {
        paginaAnterior:'/tabs/tab3'
      }
    };
    this.router.navigate(['/registro'], navigationExtras);
  }
  
  
  verFavoritos(){
    const navigationExtras: NavigationExtras = {
      state: {
        paginaAnterior:'tabs/tab3'
      }
    };
    this.router.navigate(['/tabs/favoritos'], navigationExtras);
  }

  verLocal(){
    const navigationExtras: NavigationExtras = {
      state: {
        paginaAnterior:'tabs/tab3'
      }
    };
    this.router.navigate(['/tabs/dueno-local/lista-locales'], navigationExtras);
  }
}
