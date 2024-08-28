import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, Validators as Vl, UntypedFormBuilder, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiDjangoService } from 'src/app/services/api-django.service';
import { EventosService } from 'src/app/services/eventos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-local',
  templateUrl: './agregar-local.page.html',
  styleUrls: ['./agregar-local.page.scss'],
})
export class AgregarLocalPage implements OnInit {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  recurso: string = "Locales"
  lstLocales: any[]=[]
  lstTipLocal: any[]=[]
  similitud: number = 0
  selectedOption: number = 0
  selectedImage:any
  selected64:string | ArrayBuffer | null = null
  datosUsuario:any

  isLinear = false;

  constructor(
    public dialog: MatDialog,
    public router: Router,
    public fb: UntypedFormBuilder,
    private api: ApiDjangoService,
    private _formBuilder: FormBuilder,
    private eventos : EventosService
  ) {
    this.firstFormGroup = this._formBuilder.group({
      nombre: ['', Vl.required],
      direccion: ['', Vl.required],
      telefono: ['', Vl.required]
    });

    this.secondFormGroup = this._formBuilder.group({
      descripcion: ['', Vl.required],
      tipo_local: ['', Vl.required],
    });

    eventos.actualizarUsuario.subscribe((r)=>{
      this.recargarUsuario()
    })
   }

  ngOnInit() {
    this.datosUsuario = JSON.parse(localStorage.getItem('usuarioActivo') || '{}');
    this.getLocales();
    this.getTipoLocal();
  }

  recargarUsuario(){
    this.datosUsuario = JSON.parse(localStorage.getItem('usuarioActivo') || '{}');
    this.getLocales();
    this.getTipoLocal();
  }

  getLocales(){
    this.api.get("Locales").subscribe((r:any)=>{
      this.lstLocales = r
      })
   }

   getTipoLocal(){
    this.api.get("TipoLocal").subscribe((r:any)=>{
      this.lstTipLocal = r
      })
   }

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
       this.selected64 = reader.result as string;
       this.selectedImage = file
      };
      reader.readAsDataURL(file);
    }
  }

  Agregar(){
    let frm = { ...this.firstFormGroup.value, ...this.secondFormGroup.value };
    let dataLocal = {
      nombre: frm.nombre,
      direccion: frm.direccion,
      telefono: frm.telefono,
      descripcion: frm.descripcion,
      tipo_local: frm.tipo_local,
      usuario: this.datosUsuario.id
    };

    this.similitud = 0;

    this.lstLocales.forEach(local => {
      if (frm.nombre == local.nombre || frm.direccion == local.direccion) {
        this.similitud++
      }
    });

    if (this.similitud === 0) {
      this.api.post(this.recurso, dataLocal).subscribe((r: any) => {
        if (r) {
          let data = {
            descripcion: "Local "+ dataLocal.nombre +" agregado",
            usuario: this.datosUsuario.id,
            fecha: new Date(),
          }
          this.api.post("RegistroCambios", data).subscribe((r)=>{
          })
          ///// CREAR IMAGEN PARA ESTE LOCAL
  
            if (this.selectedImage) {
              const formData = new FormData();
            formData.append('local', r.id);
            formData.append('imagen', this.selectedImage, this.selectedImage.name);
            formData.append('principal', 'true');
  
            this.api.post('ImagenLocal', formData).subscribe((r) => {})
            }
            
        }
        

          });
          this.eventos.listarLocales.emit(true)
          this.router.navigate(['/tabs/dueno-local/lista-locales']);
          Swal.fire({
            toast: true,
            title: "Local Agregado Exitosamente!",
            icon: "success",
            timer: 2500,
            showConfirmButton: false,
            position: 'bottom',
            width: '90%',
            //color: '#FFFFFF',
            //background: '#00000090',
          });
    } else {
      Swal.fire({
        toast: true,
        title: "Nombre de Local o Dirección Proporcionada Ya En Uso!",
        icon: "error",
        timer: 2500,
        showConfirmButton: false,
        position: 'bottom',
        width: '90%',
        //color: '#FFFFFF',
        //background: '#00000090',
      });
    }
  }
  
   goBack() {
    this.router.navigate(['/tabs/dueno-local/lista-locales']);
  }
}
