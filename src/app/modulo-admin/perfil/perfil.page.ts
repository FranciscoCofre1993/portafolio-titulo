import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventosService } from 'src/app/services/eventos.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

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
}
