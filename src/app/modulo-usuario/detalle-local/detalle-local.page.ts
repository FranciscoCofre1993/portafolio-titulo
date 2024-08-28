import { Component, OnDestroy, OnInit } from '@angular/core';
import { TabsPage } from '../tabs/tabs.page';
import { NavigationExtras, Router } from '@angular/router';
import { ApiDjangoService } from 'src/app/services/api-django.service';
import Swal from 'sweetalert2';
import { EventosService } from 'src/app/services/eventos.service';
import { Subscription } from 'rxjs';
import { Filesystem, Directory, Encoding, FilesystemDirectory } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';
import jsPDF from 'jspdf';
declare var cordova: any;

@Component({
  selector: 'app-detalle-local',
  templateUrl: './detalle-local.page.html',
  styleUrls: ['./detalle-local.page.scss'],
  
})
export class DetalleLocalPage implements OnInit, OnDestroy {
  selectedLocal:any
  datosUsuario:any
  paginaAnterior:string=''
  lstProductos:any[]=[]
  lstFavoritos:any[]=[]
  lstCalificacion:any[]=[]
  esFavorito:boolean = false
  calificacionTotal:number=0
  suscripcion:any

  constructor(
    private router: Router,
    private api: ApiDjangoService,
    private eventos: EventosService,
  ) { 
    this.suscripcion = eventos.recargarLocal.subscribe((r)=>{
      console.log("suscrito");
      this.getThisLocal();
      this.getProductosLocal();
      this.setFav();
      this.setCalificacion();
    })
   }

  ionViewWillEnter(){
   
  }
ngOnDestroy(): void {
  console.log("DESUSCRITO");
    this.suscripcion.unsubscribe();

}
  ngOnInit() {
    this.datosUsuario = JSON.parse(localStorage.getItem('usuarioActivo') || '{}');
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state) {
       this
       .selectedLocal = state['item'];
       this.paginaAnterior = state['paginaAnterior']
    }
    this.getThisLocal();
    this.getProductosLocal();
    this.setFav();
    this.setCalificacion();
    
  }

  
  getThisLocal(){
      this.api.get(`Locales/${this.selectedLocal.id}`).subscribe((r:any)=>{
        this.selectedLocal = r
      });
  }
  
  getProductosLocal(){
    
    this.api.get(`Producto`).subscribe((r:any)=>{
      this.lstProductos = r
      this.lstProductos = this.lstProductos.filter(producto=> producto.local == this.selectedLocal.id)
    });
  }

  detalleProducto(item:any){

  }

  backBtn(){
    this.router.navigate([this.paginaAnterior])
  }

  async setFav(){
    
    this.api.get(`Favorito/`).subscribe((r:any)=>{
      this.lstFavoritos = r

       this.lstFavoritos =  this.lstFavoritos.filter(fav=> fav.usuario == this.datosUsuario.id 
                                                        && fav.local == this.selectedLocal.id);
      if (this.lstFavoritos.length == 0) {
        this.esFavorito = false
      }else{
        this.esFavorito = true
      }
    })
  }

  marcarFav(){
    if (this.esFavorito) {

      this.esFavorito = false
       this.lstFavoritos.forEach(fav => {
        this.api.delete(`Favorito/`, fav.id).subscribe((r:any)=>{
          this.setFav();
          Swal.fire({
            toast: true,
            title: "Favorito Eliminado!",
            icon: "error",
            timer: 2500,
            showConfirmButton: false,
            position: 'bottom',
            width: '70%',
            //color: '#FFFFFF',
            //background: '#00000090',
          });
        });
      });

    } else {
      this.esFavorito = true
      let data = {
        usuario: this.datosUsuario.id,
        local: this.selectedLocal.id
      }

      this.api.post(`Favorito`, data).subscribe((r:any)=>{
        Swal.fire({
          toast: true,
          title: "Favorito Agregado!",
          icon: "success",
          timer: 2500,
          showConfirmButton: false,
          position: 'bottom',
          width: '70%',
          //color: '#FFFFFF',
          //background: '#00000090',
        });
        this.setFav();
      })
    }
  }

  calificacion(){
    const navigationExtras: NavigationExtras = {
      state: {
        item: this.selectedLocal,
        paginaAnterior:'detalle-local'
      }
    };
    this.router.navigate(['/tabs/calificacion'], navigationExtras);
    this.eventos.actualizarComentarios.emit(true);
  }

  setCalificacion(){

   this.api.get(`Calificacion`).subscribe((r:any)=>{
      this.calificacionTotal = 0
      let conteo = 0
      if (r) {
        this.lstCalificacion = r;
      this.lstCalificacion = this.lstCalificacion.filter(calificacion=> calificacion.local == this.selectedLocal.id)
      this.lstCalificacion.forEach(calificacion => {
        conteo = (conteo + calificacion.estrellas)
      });
      this.calificacionTotal = conteo / this.lstCalificacion.length
      }
      });
      
  }

  handleRefresh(event:any) {
    setTimeout(() => { 
      this.getThisLocal();
      this.getProductosLocal();
      this.setFav();
      this.setCalificacion();
      event.target.complete();
    }, 1000);
  }

  async descargarMenu(){
  let productoMasGrande = this.lstProductos.reduce(
      function (a, b) {
          return a.length > b.length ? a : b;
      }
  );
    const doc = new jsPDF('p', 'mm', 'a4', true);
    let fila = 30
    let maxLength = productoMasGrande.nombre.length*4 + 20
    let posicionFotoCol = maxLength + 40
    let posicionFotoFil = 0
    let imagen:any
    let conteoProductos = 0
  doc.text(`Menú: ${this.selectedLocal.nombre}` , 10, 10);
  doc.text(`Dirección: ${this.selectedLocal.direccion}` , 10, 20);
  
  
  this.lstProductos.forEach(producto => {
    conteoProductos ++
    posicionFotoFil = fila + 20
    fila = fila + 30
   
    imagen = producto.imagen
    doc.addImage(imagen, 10, posicionFotoFil, 20,20);

    doc.text(`${producto.nombre} ` , 40, fila );

    doc.text(`$${parseInt(producto.precio)}` , 150, fila);

      
      if (conteoProductos > 7) {
        doc.addPage();
        conteoProductos = 0
        fila = 20

      }
    });

    const pdfOutput = doc.output('arraybuffer');
    const fileName = `Menú ${this.selectedLocal.nombre}.pdf`;

    doc.save(fileName);

    Swal.fire({
      toast: true,
      title: 'Menú descargado!',
      icon: 'success',
      timer: 2500,
      showConfirmButton: false,
      position: 'bottom',
      width: '90%',
      //color: '#FFFFFF',
      //background: '#00000090',
    });

    try {
      // Convierte el array buffer a una cadena base64
      const base64String = this.arrayBufferToBase64(pdfOutput);

      // Escribe el archivo en el sistema de archivos sin especificar encoding
      await Filesystem.writeFile({
        path: fileName,
        data: base64String,
        directory: Directory.Documents,
      });

      // Obtén la ruta del archivo guardado
      const fileUri = await Filesystem.getUri({
        directory: Directory.Documents,
        path: fileName,
      });

      // Abre el archivo PDF con la aplicación predeterminada
      await FileOpener.open({
        filePath: fileUri.uri,
        contentType: 'application/pdf',
      });

      console.log('Archivo PDF abierto correctamente');
    } catch (error) {
      console.error('Error al guardar o abrir el archivo', error);
    }
  }

  arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
}