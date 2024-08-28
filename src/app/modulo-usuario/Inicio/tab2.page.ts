import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FrmFiltrosComponent } from '../components/frm-filtros/frm-filtros.component';
import { ApiDjangoService } from 'src/app/services/api-django.service';
import { GeoCodingService } from 'src/app/services/geo-coding.service';
import { NavigationExtras, Router } from '@angular/router';
import { EventosService } from 'src/app/services/eventos.service';
import * as L from 'leaflet';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})

export class Tab2Page implements OnInit{
  show:boolean = false ;
  recurso: string ="local";
  lstProductos: any[]=[];
  lstLocales: any[]=[];
  filtros: any;
  lstMarkers: any[]=[];
  lat:any
  lng:any
  constructor(
    public dialog: MatDialog,
    private api: ApiDjangoService,
    private apiG:GeoCodingService,
    private router:Router,
    private eventos:EventosService,
    private loadingController: LoadingController,
  ) { 

    this.eventos.filtrar.subscribe((r) => {
      this.filtrarLocales();
    });
    this.eventos.eliminarFiltros.subscribe((r) => {
      this.getLocales();
      this.filtros = null;
    });

  }

    ngOnInit(): void {
      this.eventos.actualizarUsuario.emit(true)
      this.getProductos()
      this.getLocales()
      const state = this.router.getCurrentNavigation()?.extras.state;
    if (state) {
      const id = state['id'];;
    }
    }

    openDialog(){
      this.dialog.open(FrmFiltrosComponent);
      localStorage.setItem('paginaActual',  "/tabs/tab2") ;
    }

    getProductos(){
      this.api.get("Producto").subscribe((r:any)=>{
        this.lstProductos = r
      })
    }

    getLocales(){
      this.api.get("Locales").subscribe((r:any)=>{
        this.lstLocales = r
      })
      if (this.filtros) {
        this.setUbicaciones()
      }
    }

    detalle(item:any){
      const navigationExtras: NavigationExtras = {
        state: {
          item: item,
          paginaAnterior:'tabs/tab2'
        }
      };
      this.eventos.recargarLocal.emit(true);
      this.router.navigate(['detalle-local'], navigationExtras);
      
    }

    marcarRuta(item:any){
      const navigationExtras: NavigationExtras = {
        state: {
          item: item,
          paginaAnterior:'tabs/tab2'
        }
      };
      
      this.router.navigate(['tabs/tab1'], navigationExtras);
      this.eventos.marcarRuta.emit(true);
    }

    handleRefresh(event:any) {
      setTimeout(() => { 
        this.getLocales()
        event.target.complete();
      }, 1000);
    }
  


    //////////////////
    // FILTROS MAPA
    //////////////////

    setFiltros() {
      this.filtros = JSON.parse(localStorage.getItem('filtros') || '{}');
    }

    async loadingFltr() {
      const loading = await this.loadingController.create({
        message: 'Aplicando Tus Filtros...',
        backdropDismiss: false,
        cssClass: 'custom-loading'
      });
      await loading.present(); 
    }
    
    
    async filtrarLocales() {
      await this.setFiltros();
      await this.loadingFltr();
  
      let localesFiltrados: any[] = [];
  
      /// Crear una lista de promesas para manejar las operaciones asincrónicas
      let promesas = this.lstLocales.map(async (localFiltro) => {
        let lstProductos = await this.api.get('Producto').toPromise();
        // Filtrar productos de este local
        lstProductos = lstProductos.filter(
          (producto: any) => producto.local == localFiltro.id
        );
  
        // Filtrar productos por tipo si no se seleccionó TODOS
        if (this.filtros.tipo_producto != 0) {
          lstProductos = lstProductos.filter(
            (producto: any) =>
              producto.tipo_producto == this.filtros.tipo_producto
          );
        }
  
        // Filtrar productos por precio
        lstProductos = lstProductos.filter(
          (producto: any) =>
            producto.precio >= this.filtros.precioMinimo &&
            producto.precio <= this.filtros.precioMaximo
        );
  
        /// SI QUEDAN PRODUCTOS EN LA LISTA
        if (lstProductos.length > 0) {
          // agrega a locales filtrados el local que tiene productos que coincidan
          localesFiltrados.push(localFiltro);
        }
      });
  
      // Esperar a que todas las promesas se resuelvan
      await Promise.all(promesas);
  
      // Luego de rescatar todos los locales con características necesarias, podemos hacer el marker como corresponde
      this.lstLocales = localesFiltrados;
      this.loadingController.dismiss();
  
      // Llamar a setUbicaciones
      this.setUbicaciones();
    }



    setUbicaciones() {
  
      let radioFiltro:any = null;
      if (this.filtros && this.filtros.rango != null && this.filtros.rango < 5) {
        radioFiltro = L.circle([this.lat, this.lng], {
          color: 'orange',
          fillColor: '#EA6B18',
          fillOpacity: 0.07,
          radius: this.filtros.rango * 1000,
        });
      }
  
      this.lstLocales.forEach((local) => {
        this.apiG.get(local.direccion).subscribe((r) => {
          if (r.features) {
            const coordinates = r.features[0]?.geometry?.coordinates;
            if (coordinates) {
              const localLatLng = L.latLng(coordinates[1], coordinates[0]);
  
              if (
                radioFiltro &&
                !radioFiltro.getBounds().contains(localLatLng) &&
                this.filtros.rango < 5 
              ) {
                return;
              }

              this.lstMarkers.push({
                nombre: local.nombre,
                ruta: coordinates,
              });
            }
          }
        });
      });
    }
}