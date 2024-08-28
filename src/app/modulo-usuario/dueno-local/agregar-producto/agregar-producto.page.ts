import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, Validators as Vl, UntypedFormBuilder, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiDjangoService } from 'src/app/services/api-django.service';
import { EventosService } from 'src/app/services/eventos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.page.html',
  styleUrls: ['./agregar-producto.page.scss'],
})
export class AgregarProductoPage implements OnInit {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  
  lstLocales: any[]=[];

  recurso: string = "Producto"
  lstProductos: any[]=[]
  lstTipProducto: any[]=[]
  similitud: number = 0
  selectedOption: number = 0
  selectedImage: string | undefined

  local: any;

  isLinear = false;
  
  constructor(
    public dialog: MatDialog,
    public router: Router,
    public fb: UntypedFormBuilder,
    private api: ApiDjangoService,
    private _formBuilder: FormBuilder,
    private eventos: EventosService
  ) { 
    
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.local = navigation.extras.state['item'];
    } else {
      this.local = { nombre: 'Nombre del Local' };
      console.error('No se encontraron datos en la navegación extras.state');
    }

    this.firstFormGroup = this._formBuilder.group({
      nombreLocal: [{ value: this.local.nombre, disabled: true }],
      nombre: ['', [Vl.required]],
      descripcion: ['', [Vl.required]],
      precio: ['', [Vl.required]],
      tipo_producto: ['', [Vl.required]],
    });
    this.secondFormGroup = this._formBuilder.group({
      imagen: ['', [Vl.required]],
    });
  }

    
  ionVieWWillEnter(){
    this.getLocales();
    this.getProductos();
    this.getTipoProducto();
    
  }

  ngOnInit() {
    this.getLocales();
    this.getProductos();
    this.getTipoProducto();
  }

  getLocales(){
    this.api.get("Locales").subscribe((locales)=>{
      this.lstLocales = locales
    });
  }

  getProductos(){
    this.api.get("Producto").subscribe((r:any)=>{
      this.lstProductos = r
      })
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
        this.selectedImage = reader.result as string;
        this.secondFormGroup.patchValue({ imagen: this.selectedImage });
      };
      reader.readAsDataURL(file);
    }
  }

  Agregar(){
    let frm = { ...this.firstFormGroup.value, ...this.secondFormGroup.value };
    let data = {
      tipo_producto: frm.tipo_producto,
      nombre: frm.nombre,
      descripcion: frm.descripcion,
      precio: frm.precio,
      imagen: frm.imagen,
      local: this.local.id
    };

    this.similitud = 0;

    this.lstProductos.forEach(producto => {
      if (frm.descripcion == producto.descripcion) {
        this.similitud++
      }
    });

    if (this.similitud === 0) {
      this.api.post(this.recurso, data).subscribe((r: any) => {
        });
          this.router.navigate(['/tabs/dueno-local/lista-productos']);
          Swal.fire({
            toast: true,
            title: "Producto Agregado Exitosamente!",
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
        title: "Nombre de Producto Proporcionado Ya En Uso!",
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
    this.router.navigate(['/tabs/dueno-local/lista-productos']);
  }
}