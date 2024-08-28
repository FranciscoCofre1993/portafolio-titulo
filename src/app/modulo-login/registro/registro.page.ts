import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TerminosYCondicionesComponent } from '../components/terminos-y-condiciones/terminos-y-condiciones.component';
import {  Router } from '@angular/router';
import { MatCardLgImage } from '@angular/material/card';
import { FormBuilder, UntypedFormGroup, FormGroup, Validators as Vl, UntypedFormBuilder } from '@angular/forms';
import { ApiDjangoService } from 'src/app/services/api-django.service';
import { TermsRegistroComponent } from '../components/terms-registro/terms-registro.component';
import Swal from 'sweetalert2';
import {  encrypt } from 'src/app/services/encriptacion';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})

export class RegistroPage implements OnInit {
  pass:any
  recurso: string = "Usuario"
  lstUsuarios: any[]=[]
  lstPerfiles: any[]=[]
  similitud: number = 0

  hide = true;
  hidevl = true;
  paginaAnterior: any;

  constructor(
    public dialog: MatDialog,
    public router: Router,
    public fb: UntypedFormBuilder,
    private api: ApiDjangoService
  ) {}
  frmRegistro : UntypedFormGroup  = this.fb.group(
    {
      nombre: [null, [Vl.required]],
      usuario: [null, [Vl.required]],
      correo: [null, [Vl.required]],
      telefono: [null, [Vl.required]],
      password: [null, [Vl.required]],
      vlpass: [null, [Vl.required]],
      check: [null, [Vl.required]],
    }
  )

  esconderPass(event: MouseEvent | TouchEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }

  esconderPassVl(event: MouseEvent | TouchEvent) {
    this.hidevl = !this.hidevl;
    event.stopPropagation();
  }

  ngOnInit() {
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state) {
       this.paginaAnterior = state['paginaAnterior']
    }
    this.getUsers();
    this.getPefil();
  }

  checkedBtn : boolean = false;

  changeEvent(event:any){
    if(event.value){
      this.checkedBtn = false;
    }else{
      this.checkedBtn = true;
    }
  }

  openDialog(){
      this.dialog.open(TermsRegistroComponent);
  }
    
 ir(){
  this.frmRegistro.reset();
  this.router.navigate([this.paginaAnterior])
  }

 getUsers(){
  this.api.get("Usuario").subscribe((r:any)=>{
    this.lstUsuarios = r
    })
  }

  getPefil(){
    this.api.get("Perfil").subscribe((r:any)=>{
      this.lstPerfiles = r
      })
   }

 Guardar(){
  let frm = this.frmRegistro.value
  if (frm.password == frm.vlpass && frm.check == true){
    if (frm.correo.includes('@')){

     this.pass = encrypt(frm.password);
     let data = {
      nombre: frm.nombre,
      usuario: frm.usuario,
      correo: frm.correo,
      telefono: frm.telefono,
      contrasenna: this.pass,
      perfil: 1
    }
    this.lstUsuarios.forEach(usuario => {
      if (frm.usuario == usuario.usuario || frm.correo == usuario.correo) {
        this.similitud++
      }
    });
    if (this.similitud == 0) {
      this.api.post(this.recurso, data).subscribe((r:any)=>{
      })
      this.frmRegistro.reset();
      this.router.navigate(['/login']);
      Swal.fire({
        toast: true,
        title: 'Registro Exitoso!',
        icon: 'success',
        timer: 2500,
        showConfirmButton: false,
        position: 'bottom',
        width: '90%',
        //color: '#FFFFFF',
        //background: '#00000090',
      });
      this.similitud--
    } else {
      Swal.fire({
        toast: true,
        title: 'El Nombre de Usuario o Correo Proporcionados Ya Están en Uso',
        icon: 'error',
        timer: 2500,
        showConfirmButton: false,
        position: 'bottom',
        width: '90%',
        //color: '#FFFFFF',
        //background: '#00000090',
      });
      this.similitud--
    }
    }else{
      Swal.fire({
        toast: true,
        title: "Por Favor, Proporciona Una Dirección de Correo Válida",
        icon: "error",
        timer: 2500,
        showConfirmButton: false,
        position: 'bottom',
        width: '90%',
        //color: '#FFFFFF',
        //background: '#00000090',
      });}
  } else {
    Swal.fire({
      toast: true,
      title: 'La contraseña debe ser idéntica en ambos campos.',
      icon: 'error',
      timer: 2500,
      showConfirmButton: false,
      position: 'bottom',
      width: '90%',
      //color: '#FFFFFF',
      //background: '#00000090',
    });
  }
 }
}