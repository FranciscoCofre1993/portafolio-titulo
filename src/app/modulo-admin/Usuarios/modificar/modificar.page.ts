import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiDjangoService } from 'src/app/services/api-django.service';
import { desencrypt, encrypt } from 'src/app/services/encriptacion';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificar',
  templateUrl: './modificar.page.html',
  styleUrls: ['./modificar.page.scss'],
})
export class ModificarPage implements OnInit {
  usuario: any;
  lstPerfil: any[] = [];

  constructor(public router: Router, private api: ApiDjangoService) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.usuario = navigation.extras.state['item'];
      this.usuario.contrasenna = desencrypt(this.usuario.contrasenna);
    }
  }

  ngOnInit() {
    if (!this.usuario) {
      this.router.navigate(['lista-usuarios']);
    } else {
      this.getPerfil();
    }
  }

  getPerfil() {
    this.api.get('Perfil').subscribe((perfil) => {
      this.lstPerfil = perfil;
    });
  }

  onOptionSelected(event: any) {
    this.usuario.perfil = event.value;
  }

  onSubmit() {
    let dataUsuario = this.usuario;
    this.api
      .update('Usuario', this.usuario.id, {
        contrasenna:  encrypt(dataUsuario.contrasenna),
        correo: dataUsuario.correo,
        id: dataUsuario.id,
        nombre: dataUsuario.nombre,
        perfil: dataUsuario.perfil,
        telefono: dataUsuario.telefono,
        usuario: dataUsuario.usuario,
      })
      .subscribe((response: any) => {
        this.router.navigate(['/tabs-admin/lista-usuarios']);
        Swal.fire({
          toast: true,
          title: 'Usuario Modificado Exitosamente!',
          icon: 'success',
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
    this.router.navigate(['/tabs-admin/lista-usuarios']);
  }
}
