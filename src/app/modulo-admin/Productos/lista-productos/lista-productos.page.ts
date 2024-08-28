import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ApiDjangoService } from 'src/app/services/api-django.service';
import { ConfDeleteProductoDialogComponent } from '../components/conf-delete-producto-dialog/conf-delete-producto-dialog.component'
import Swal from 'sweetalert2';
import { EventosService } from 'src/app/services/eventos.service';

@Component({
  selector: 'app-lista-productos',
  templateUrl: './lista-productos.page.html',
  styleUrls: ['./lista-productos.page.scss'],
})
export class ListaProductosPage implements OnInit {
  lstProductos: any[]=[];
  lstLocales: any[]=[];
  lstTipProducto: any[] = [];
  selectedLocal:any;
  paginaAnterior:any;

  
  showDeleteButtons: boolean = false;

  constructor(
    private api: ApiDjangoService,
    private router:Router,
    private dialog: MatDialog,
    private eventos: EventosService,

  ) {
    this.eventos.actualizarLocal.subscribe((local: any) => {
      this.selectedLocal = local;
      this.getProductos();
    });
   }

  ionViewWillEnter(){
    this.getProductos();
    this.getLocales();
    this.getTipoProducto();
  }

  ngOnDestroy() {
    // Importante: Desuscribirse del evento al destruir el componente
    this.eventos.actualizarLocal.unsubscribe();
  }

  ngOnInit() {
    this.selectedLocal = null;
    this.getProductos();
    this.getLocales();
    this.getTipoProducto();
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state) {
       this
       .selectedLocal = state['item'];
       this.paginaAnterior = state['paginaAnterior']
    }
    
  }

  getLocales(){
    this.api.get("Locales").subscribe((locales)=>{
      this.lstLocales = locales
    });
  }

  getTipoProducto() {
    this.api.get("TipoProducto").subscribe((data: any[]) => {
      this.lstTipProducto = data;
    });
  }

  getLocalName(localId: number): string {
    const local = this.lstLocales.find(local => local.id === localId);
    return local ? local.nombre : 'Local no encontrado';
  }

  getTipoProductoName(tipoProductoId: number): string {
    const tipoProducto = this.lstTipProducto.find(tipo => tipo.id === tipoProductoId);
    return tipoProducto ? tipoProducto.nombre : 'Tipo de producto no encontrado';
  }

  async getProductos(){
    this.lstProductos = [];
    await this.api.get("Producto").subscribe((productos)=>{
      this.lstProductos = productos
      this.lstProductos.sort((a, b) => b.id - a.id);
      this.lstProductos =  this.lstProductos.filter(producto=> producto.local == this.selectedLocal.id)
    });
  }

  detalle(item:any){
    const navigationExtras: NavigationExtras = {
      state: {
        item: item,
        paginaAnterior:'/tabs-admin/lista-productos'
      }
    };
    this.eventos.RecargarProductos.emit(true);
    this.router.navigate(['/tabs-admin/lista-productos/modificar-producto'], navigationExtras);
  }

  goAgregarProducto() {
    const navigationExtras: NavigationExtras = {
      state: {
        item: this.selectedLocal,
        paginaAnterior: '/tabs-admin/lista-productos'
      }
    };
    this.router.navigate(['/tabs-admin/lista-productos/agregar-productos'], navigationExtras);
  }

  toggleAllDeleteButtons() {
    this.showDeleteButtons = !this.showDeleteButtons;
  }

  deleteProducto(item: any): void {
    this.api.delete("Producto", item.id).subscribe((response: any) => {

      this.getProductos();
    });
  }

  openConfirmationDialog(item: any, event: Event): void {
    event.stopPropagation(); 

    const dialogRef = this.dialog.open(ConfDeleteProductoDialogComponent, {disableClose:true, panelClass: 'custom-container'});

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteProducto(item);
        Swal.fire({
          toast: true,
          title: "Producto Eliminado!",
          icon: "success",
          timer: 2500,
          showConfirmButton: false,
          position: 'bottom',
          width: '70%',
          //color: '#FFFFFF',
          //background: '#00000090',
        });
      }
    });
  }

  handleRefresh(event:any) {
    setTimeout(() => { 
      this.getProductos()
      event.target.complete();
    }, 1000);
  }

  fabOpen = false;

  toggleFab() {
    this.fabOpen = !this.fabOpen;
  }

}
