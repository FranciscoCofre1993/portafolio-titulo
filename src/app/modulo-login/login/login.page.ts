import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router, RouterLink } from '@angular/router';
import { ApiDjangoService } from 'src/app/services/api-django.service';
import { FormBuilder, UntypedFormGroup, FormGroup, Validators as Vl, UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TerminosYCondicionesComponent } from '../components/terminos-y-condiciones/terminos-y-condiciones.component';
import Swal from 'sweetalert2'
import { EventosService } from 'src/app/services/eventos.service';
import { desencrypt } from 'src/app/services/encriptacion';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  hide = true;
  lstUsuarios:any[]=[]

  frm : UntypedFormGroup  = this.fb.group(
    {
      usuario: [null, [Vl.required]],
      password: [null, [Vl.required]],
    }
  )

  constructor(
    public dialog: MatDialog,
    private router : Router,
    public fb: UntypedFormBuilder,
    private api : ApiDjangoService,
    private eventos : EventosService,
  ) { }

  esconderPass(event: MouseEvent | TouchEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }

  ngOnInit() {
    localStorage.clear();
  }

  ir(){
    const navigationExtras: NavigationExtras = {
      state: {
        paginaAnterior:'/login'
      }
    };
    this.router.navigate(['/registro'], navigationExtras);
  }

  openDialog(){
    this.dialog.open(TerminosYCondicionesComponent);
    localStorage.setItem('usuarioActivo', JSON.stringify({
      "usuario":"invitado",
      "correo":"invitado",
      "perfil":0,
    }));
  }

  limpiar(){
    this.frm.reset()
  }

  login(){
    this.api.get("Usuario").subscribe((r:any)=>{
      this.lstUsuarios = r
      let dataForm = this.frm.value
      this.lstUsuarios.forEach(user => {
        
        if (dataForm.usuario == user.usuario && dataForm.password == desencrypt(user.contrasenna)) {
          this.limpiar();
          localStorage.setItem('usuarioActivo', JSON.stringify(user));
      this.eventos.actualizarUsuario.emit(true)

          if (user.perfil == 2) {
            this.router.navigate(['/tabs-admin']);
          } else {
            this.router.navigate(['/tabs']);
          }
          
          Swal.fire({
            toast: true,
            title: "Bienvenido!",
            icon: "success",
            timer: 2500,
            showConfirmButton: false,
            position: 'bottom',
            width: '60%',
            //color: '#FFFFFF',
            //background: '#00000090',
          });
        }
      });
      if (this.lstUsuarios.filter(usuario=> dataForm.usuario == usuario.usuario && dataForm.password==desencrypt(usuario.contrasenna)).length == 0) {
        Swal.fire({
          toast: true,
          title: "Credenciales no coinciden!",
          icon: "error",
          timer: 2500,
          showConfirmButton: false,
          position: 'bottom',
          width: '60%',
          //color: '#FFFFFF',
          //background: '#00000090',
        });
      }
    })
  }
}
