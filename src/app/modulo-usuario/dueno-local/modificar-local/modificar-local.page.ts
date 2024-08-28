import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiDjangoService } from 'src/app/services/api-django.service';
import { EventosService } from 'src/app/services/eventos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificar-local',
  templateUrl: './modificar-local.page.html',
  styleUrls: ['./modificar-local.page.scss'],
})
export class ModificarLocalPage implements OnInit {
  local: any;
  imagen64: string | ArrayBuffer | null = null;
  selectedImage: any;

  imagenes64: any[] = [];
  selectedImages: any[] = [];

  removeExistingImage: boolean = false;

  datosUsuario:any

  constructor(
    public router: Router,
    private api: ApiDjangoService,
    private eventos: EventosService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.local = navigation.extras.state['item'];
      this.getLocal();
    }

    eventos.recargarLocal.subscribe((r)=>{
      this.getLocal();
    })
  }

  ngOnInit() {
    this.datosUsuario = JSON.parse(localStorage.getItem('usuarioActivo') ?? '{}');
    if (!this.local) {
      this.router.navigate(['/tabs/dueno-local/lista-locales']);
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagen64 = reader.result;
      };
      reader.readAsDataURL(file);

      this.selectedImage = file;
    }
  }

  agregarImagenesSecundarias(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenes64.push(reader.result);
      };
      reader.readAsDataURL(file);

      this.selectedImages.push(file);
    }
  }

  async updateImage() {
    if (this.selectedImage) {
      const formData = new FormData();
      formData.append('local', this.local.id.toString());
      formData.append('imagen', this.selectedImage, this.selectedImage.name);
      formData.append('principal', 'true');

      this.api.post('ImagenLocal', formData).subscribe((r) => {
        this.eventos.listarLocales.emit(true);
        let data = {
          descripcion: "Imagen agregada en Local " + this.local.nombre,
          usuario: this.datosUsuario.id,
          fecha: new Date(),
        }
        this.api.post("RegistroCambios", data).subscribe((r)=>{
        })
      });
    }
  }

  removeImage(imagen: any) {
    this.api.delete('ImagenLocal', imagen.id).subscribe((r) => {

      this.getLocal();
      let data = {
        descripcion: "Imagen de local eliminada",
        usuario: this.datosUsuario.id,
        fecha: new Date(),
      }
      this.api.post("RegistroCambios", data).subscribe((r)=>{
      })
    });
  }

  async onSubmit() {
    let dataLocal = {
      nombre: this.local.nombre,
      direccion: this.local.direccion,
      telefono: this.local.telefono,
      descripcion: this.local.descripcion,
      tipo_local: this.local.tipo_local,
      usuario: this.local.usuario
    };
    this.api
      .update('Locales', this.local.id, dataLocal)
      .subscribe((response: any) => {
        let data = {
          descripcion: "Local " + this.local.nombre + " editado",
          usuario: this.datosUsuario.id,
          fecha: new Date(),
        }
        this.api.post("RegistroCambios", data).subscribe((r)=>{
        })
      });
    if (this.selectedImage && this.local.imagenes.length > 0) {
      let imagenes = this.local.imagenes;
      let imagenPrincipal = imagenes.find((img: any) => img.principal = true);
      this.api
        .delete('ImagenLocal', imagenPrincipal.id)
        .subscribe((r) => {});
      await this.updateImage();
    }
    if (this.local.imagenes.length == 0) {
      await this.updateImage();
    }
    if (this.selectedImages.length > 0) {
      this.selectedImages.forEach((imagen) => {
        const formData = new FormData();
        formData.append('local', this.local.id.toString());
        formData.append('imagen', imagen, imagen.name);
        formData.append('principal', 'false');

        this.api.post('ImagenLocal', formData).subscribe((r) => {});
      });
    }
    
    this.eventos.listarLocales.emit(true);
    this.localModificado();
  }

  getLocal() {
    this.api.get(`Locales/${this.local.id}`).subscribe((r) => {
      this.local = r;
    });
  }

  localModificado() {
    this.imagen64 = null;
    this.selectedImage = null;
    this.removeExistingImage = false;
    this.imagenes64 = [];
    this.selectedImages = [];

    this.router.navigate(['/tabs/dueno-local/lista-locales']);
    Swal.fire({
      toast: true,
      title: 'Local Modificado Exitosamente!',
      icon: 'success',
      timer: 2500,
      showConfirmButton: false,
      position: 'bottom',
      width: '90%',
      //color: '#FFFFFF',
      //background: '#00000090',
    });
  }
}

