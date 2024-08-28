import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiDjangoService } from 'src/app/services/api-django.service';
import { desencrypt, encrypt } from 'src/app/services/encriptacion';
import { EventosService } from 'src/app/services/eventos.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.page.html',
  styleUrls: ['./editar-usuario.page.scss'],
})
export class EditarUsuarioPage implements OnInit {

  usuario: any;
  isDuenoLocal:boolean = false;
  
  constructor(
    public router: Router,
    private api: ApiDjangoService,
    private eventos:EventosService
  ) {

    this.usuario = JSON.parse(localStorage.getItem('usuarioActivo') || '{}');
    this.usuario.contrasenna = desencrypt(this.usuario.contrasenna)
  }

  ngOnInit() {
    if (this.usuario.perfil == 4) {
      this.isDuenoLocal = true
    }
  }

  onSubmit() {
    if (this.isDuenoLocal == false) {
      this.usuario.perfil = 1
    } else {
      this.usuario.perfil = 4
    }
    let dataUsuario = this.usuario
    this.api.update("Usuario", this.usuario.id, {
        contrasenna:  encrypt(dataUsuario.contrasenna),
        correo: dataUsuario.correo,
        id: dataUsuario.id,
        nombre: dataUsuario.nombre,
        perfil: dataUsuario.perfil,
        telefono: dataUsuario.telefono,
        usuario: dataUsuario.usuario,
      }).subscribe((response: any) => {
      localStorage.setItem('usuarioActivo', JSON.stringify(response));
      this.eventos.actualizarUsuario.emit(true)
      this.router.navigate(['tabs/tab3']);
      Swal.fire({
        toast: true,
        title: "Usuario Modificado Exitosamente!",
        icon: "success",
        timer: 2500,
        showConfirmButton: false,
        position: 'bottom',
        width: '95%',
        //color: '#FFFFFF',
        //background: '#00000090',
      });
    });
  }

  goBack() {
    this.router.navigate(['tabs/tab3']);
    if (this.usuario.perfil == 1) {
      this.isDuenoLocal = false
    } else {
      this.isDuenoLocal = true
    }
  }
}