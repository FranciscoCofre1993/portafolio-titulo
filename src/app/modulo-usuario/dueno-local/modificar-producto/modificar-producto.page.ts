import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiDjangoService } from 'src/app/services/api-django.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-modificar-producto',
  templateUrl: './modificar-producto.page.html',
  styleUrls: ['./modificar-producto.page.scss'],
})
export class ModificarProductoPage implements OnInit {
  producto: any;
  lstTipProducto: any[]=[]
  selectedImage: string | ArrayBuffer | null = null;
  removeExistingImage: boolean = false;

  constructor(
    public router: Router,
    private api: ApiDjangoService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.producto = navigation.extras.state['item'];
   }
   }

  ngOnInit() {
    if (!this.producto) {
      this.router.navigate(['/tabs/dueno-local/lista-productos']);
    } else {
      this.getTipoProducto();
    }
  }

  getTipoProducto(){
    this.api.get("TipoProducto").subscribe((r:any)=>{
      this.lstTipProducto = r
      })
   }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  updateImage() {
    if (this.selectedImage) {
      this.producto.imagen = this.selectedImage;
    }
  }

  removeImage() {
    this.removeExistingImage = true;
    this.producto.imagen = null;
    this.selectedImage = null;
  }

  onSubmit() {
    if (this.removeExistingImage) {
      this.producto.imagen = null;
    }
    this.updateImage();
    this.api.update("Producto", this.producto.id, this.producto).subscribe((response: any) => {
      this.router.navigate(['/tabs/dueno-local/lista-productos']);
      Swal.fire({
        toast: true,
        title: "Local Modificado Exitosamente!",
        icon: "success",
        timer: 2500,
        showConfirmButton: false,
        position: 'bottom',
        width: '90%',
        //color: '#FFFFFF',
        //background: '#00000090',
      });
    });
  }

}