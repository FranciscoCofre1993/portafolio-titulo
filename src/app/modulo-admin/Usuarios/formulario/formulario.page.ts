
import { Component, OnInit, NgModule } from '@angular/core';
import { UntypedFormGroup, Validators as Vl, UntypedFormBuilder, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiDjangoService } from 'src/app/services/api-django.service';
import { desencrypt, encrypt } from 'src/app/services/encriptacion';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.page.html',
  styleUrls: ['./formulario.page.scss'],
})
export class FormularioPage implements OnInit {
  hide = true;
  hidevl = true;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  isLinear = false;

  pass:any
  recurso: string = "Usuario"
  lstUsuarios: any[]=[]
  lstPerfiles: any[]=[]
  similitud: number = 0
  selectedOption: number = 0

  constructor(
    public dialog: MatDialog,
    public router: Router,
    public fb: UntypedFormBuilder,
    private api: ApiDjangoService,
    private _formBuilder: FormBuilder,
  ) {
    this.firstFormGroup = this._formBuilder.group({
      nombre: [null, [Vl.required]],
      correo: [null, [Vl.required]],
      telefono: [null, [Vl.required]]
    });

    this.secondFormGroup = this._formBuilder.group({
      usuario: [null, [Vl.required]],
      password: [null, [Vl.required]],
      vlpass: [null, [Vl.required]],
      perfil: [null, [Vl.required]] 
    });
   }

  esconderPass(event: MouseEvent | TouchEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }

  esconderPassVl(event: MouseEvent | TouchEvent) {
    this.hidevl = !this.hidevl;
    event.stopPropagation();
  }

  ngOnInit() {
    this.getUsers();
    this.getPefil();
  }

  getPefil(){
    this.api.get("Perfil").subscribe((r:any)=>{
      this.lstPerfiles = r
      })
   }

   getUsers(){
    this.api.get("Usuario").subscribe((r:any)=>{
      this.lstUsuarios = r
      })
   }
  
  goBack() {
    this.router.navigate(['/tabs-admin/lista-usuarios']);
  }

  Agregar(){
    let frm = { ...this.firstFormGroup.value, ...this.secondFormGroup.value }
    if (frm.password == frm.vlpass) {
      if (frm.correo.includes('@')){

        this.pass = encrypt(frm.password)
        let data = {
          nombre: frm.nombre,
          correo: frm.correo,
          telefono: frm.telefono,
          usuario: frm.usuario,
          contrasenna: this.pass,
          perfil: frm.perfil
        }
        this.lstUsuarios.forEach(usuario => {
          if (frm.usuario == usuario.usuario || frm.correo == usuario.correo) {
            this.similitud++
          }
        });
        if (this.similitud == 0) {
          this.api.post(this.recurso, data).subscribe((r:any)=>{
          })
          this.router.navigate(['/tabs-admin/lista-usuarios']);
          Swal.fire({
            toast: true,
            title: "Usuario Registrado!",
            icon: "success",
            timer: 2500,
            showConfirmButton: false,
            position: 'bottom',
            width: '70%',
            //color: '#FFFFFF',
            //background: '#00000090',
          });
          this.similitud--
        } else {
          // MENSAJE "NOMBRE DE USUARIO O CORREO YA EN USO"
          Swal.fire({
            toast: true,
            title: "El Nombre de Usuario o Correo Proporcionados Ya Están en Uso",
            icon: "error",
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
          });
        }
        
      } else {
        //MENSAJE LA CONTRASEÑA DEBE SER IGUAL EN AMBOS CAMPOS
        Swal.fire({
          toast: true,
          title: "La contraseña debe ser idéntica en ambos campos.",
          icon: "error",
          timer: 2500,
          showConfirmButton: false,
        position: 'bottom',
        width: '80%',
        //color: '#FFFFFF',
        //background: '#00000090',
      });
    }
   }
}
