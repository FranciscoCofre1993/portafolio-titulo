import { Component, input } from '@angular/core';
import * as L from 'leaflet';
import { MatDialog } from '@angular/material/dialog';
import { FrmFiltrosComponent } from '../components/frm-filtros/frm-filtros.component';
import { ApiDjangoService } from 'src/app/services/api-django.service';
import { GeoCodingService } from 'src/app/services/geo-coding.service';
import { EventosService } from 'src/app/services/eventos.service';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  map: any;
  lstProductos: any[] = [];
  lstLocales: any[] = [];
  lstMarkers: any[] = [];
  direccion: string = 'Av. San Carlos 260 Puente Alto';
  filtros: any;
  lat: any;
  lng: any;
  circleLayer: any;
  allMarkers: any;
  routeLayer: any;
  selectedLocal: any;
  botonEliminarControl: any;
  selectedLocalRuta: any;

  constructor(
    public dialog: MatDialog,
    private api: ApiDjangoService,
    private apiG: GeoCodingService,
    private eventos: EventosService,
    private router: Router,
    private loadingController: LoadingController,

  ) {
    this.eventos.filtrar.subscribe((r) => {
      this.filtrarLocales();
    });

    this.eventos.marcarRuta.subscribe((r) => {
      this.clearMarkers();
      this.marcarRuta();
    });

    this.eventos.eliminarFiltros.subscribe((r) => {
      this.getLocales();
      this.filtros = null;
      this.clearCircles();
    });
  }

  ngOnInit() {
    localStorage.setItem(
      'filtros',
      JSON.stringify({
        rango: null,
      })
    );
    this.clearCircles();
    setTimeout(function () {
      window.dispatchEvent(new Event('resize'));
    }, 10);
    this.setUbiUser();
    this.getLocales();
  }

  openDialog() {
    this.dialog.open(FrmFiltrosComponent);
    localStorage.setItem('paginaActual',  "/tabs/tab1") ;
  }
  
  async getLocales() {
    await this.api.get('Locales').subscribe((r: any) => {
      this.lstLocales = r;
      this.setUbicaciones();
    });
  }

  geoCoding() {
    this.apiG.get(this.direccion).subscribe((r) => {});
  }


  setUbicaciones() {
    let ubiMarkerEnUso = false
    this.clearCircles();
    this.clearMarkers();
    this.allMarkers = [];
    if (this.routeLayer) {
      this.routeLayer.clearLayers();
    }

    this.circleLayer = L.layerGroup().addTo(this.map);
    this.allMarkers = L.layerGroup().addTo(this.map);

    let radioFiltro:any = null;
    if (this.filtros && this.filtros.rango != null && this.filtros.rango < 5) {
      radioFiltro = L.circle([this.lat, this.lng], {
        fillColor: '#9529df',
        color: 'purple',
        fillOpacity: 0.20,
        radius: this.filtros.rango * 1000,
      }).addTo(this.circleLayer);
    }
    this.eventos.filtroCargado.emit(true);
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
            /*
            this.lstMarkers.forEach(marcadoresActuales => {
              if (marcadoresActuales.ruta == coordinates) {

              ubiMarkerEnUso = true
                
              }
            });
            if (ubiMarkerEnUso) {
              console.log(coordinates);
            }
            */
            this.lstMarkers.push({
              nombre: local.nombre,
              ruta: coordinates,
            });

            var markerIcon = new L.Icon({
              iconUrl: 'https://i.imgur.com/pMMPfst.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            });
            

            const marker = L.marker([coordinates[1], coordinates[0]], {icon: markerIcon})
              .bindPopup(
                `
                <div><h1 style="text-align:center; font-size:28px; filter:drop-shadow(5px 5px 10px black);"> ${local.nombre}</h1></div>
                <div style="width: 180px; height: 1px; background-color: white; margin:auto; margin-top:-10px; margin-bottom:5px;"></div>
                <div><h1 style="text-align:center; font-size:20px; filter:drop-shadow(5px 5px 10px black);"> ${local.direccion}</h1></div>
                <div id="popup-${local.nombre}" style="cursor: pointer; justify-content:center; display:flex;">
                  <ion-button fill="outline" color="light" style="--border-radius: 40px; width:150px;">Ver detalle</ion-button>
                </div>
                <div id="popup-${local.nombre}-ruta" style="cursor: pointer; justify-content:center; display:flex;">
                  <ion-button fill="outline" color="light" style="padding-top: 10px; --border-radius: 40px; width:150px;">Marcar ruta</ion-button>
              `
              )
              .addTo(this.allMarkers);

            marker.on('click', () => {
              const popupContent = document.getElementById(
                `popup-${local.nombre}`
              );
              const popupRuta = document.getElementById(
                `popup-${local.nombre}-ruta`
              );

              if (popupContent) {
                L.DomEvent.on(popupContent, 'click', () => this.detalle(local));
              }
              if (popupRuta) {
                L.DomEvent.on(popupRuta, 'click', () => this.selectRuta(local));
              }
            });
          }
        }
      });
    });
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

  selectRuta(localRuta: any) {
    this.selectedLocalRuta = localRuta;
    this.marcarRuta();
  }

  clearCircles() {
    if (this.circleLayer) {
      this.circleLayer.clearLayers();
    }
  }

  clearMarkers() {
    if (this.allMarkers) {
      this.allMarkers.clearLayers();
    }
  }
  clearRuta() {
    this.selectedLocalRuta = null;
    if (this.routeLayer) {
      this.routeLayer.clearLayers();
    }
    this.setUbicaciones();
    if (this.botonEliminarControl) {
      this.map.removeControl(this.botonEliminarControl);
      this.botonEliminarControl = null;
    }
  }

  setFiltros() {
    this.filtros = JSON.parse(localStorage.getItem('filtros') || '{}');
  }

  detalle(item: any) {
    const navigationExtras: NavigationExtras = {
      state: {
        item: item,
        paginaAnterior: 'tabs/tab1',
      },
    };
    this.router.navigate(['detalle-local'], navigationExtras);
  }

  setUbiUser() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lng = position.coords.longitude;
        this.lat = position.coords.latitude;
        let icon = L.icon({
          iconUrl: 'https://i.imgur.com/pmj5kUX.png',
          iconSize: [55, 55],
          shadowUrl: 'https://i.imgur.com/2rwCemg.png',
          shadowSize: [120, 90],
          shadowAnchor: [48, 35],
        });
        this.map = L.map('map').setView([this.lat, this.lng], 17);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy;   <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.map);

        const customControl = L.Control.extend({
          options: {
            position: 'topleft',
          },
          onAdd: (map: L.Map) => {
            const container = L.DomUtil.create(
              'div',
              'leaflet-bar leaflet-control leaflet-control-custom'
            );
            container.style.backgroundColor = 'white';
            container.style.width = '35px';
            container.style.height = '35px';
            container.style.cursor = 'pointer';
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.justifyContent = 'center';
            const img = L.DomUtil.create('img', 'custom-icon', container);
            img.src =
              'https://icons.veryicon.com/png/o/miscellaneous/2px-common-icons/gps-8.png';
            img.style.width = '80%';
            img.style.height = '80%';

            container.onclick = () => {
              this.map.flyTo([this.lat, this.lng], 17, {
                animate: true,
                duration: 0.5,
              });
            };

            return container;
          },
        });
        this.map.addControl(new customControl());

        L.marker([this.lat, this.lng], { icon: icon }).addTo(this.map);
      });
    }
  }

  marcarRuta() {
    if (this.routeLayer) {
      this.routeLayer.clearLayers();
    }
    this.clearMarkers();
    let desde = this.lng + ',' + this.lat;
    let hasta = '';
    const state = this.router.getCurrentNavigation()?.extras.state;

    this.routeLayer = L.layerGroup().addTo(this.map);

    if (state) {
      this.selectedLocal = state['item'];
    }

    if (this.selectedLocalRuta) {
      this.selectedLocal = this.selectedLocalRuta;
    }

    this.lstMarkers.forEach((marker) => {
      if (marker.nombre == this.selectedLocal.nombre) {
        hasta = marker.ruta[0] + ',' + marker.ruta[1];

        var markerIcon = new L.Icon({
          iconUrl: 'https://i.imgur.com/pMMPfst.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        

        const marker1 = L.marker([marker.ruta[1], marker.ruta[0]], {icon: markerIcon}).bindPopup(
          `
          <div><h1 style="text-align:center; font-size:28px; filter:drop-shadow(5px 5px 10px black);"> ${this.selectedLocal.nombre}</h1></div>
          <div style="width: 180px; height: 1px; background-color: white; margin:auto; margin-top:-10px; margin-bottom:5px;"></div>
          <div><h1 style="text-align:center; font-size:20px; filter:drop-shadow(5px 5px 10px black);"> ${this.selectedLocal.direccion}</h1></div>
          <div id="popup-${this.selectedLocal.nombre}" style="cursor: pointer; justify-content:center; display:flex;">
            <ion-button fill="outline" color="light" style="--border-radius: 40px; width:150px;">Ver detalle</ion-button>
          </div>
          <div id="popup-${this.selectedLocal.nombre}-ruta" style="cursor: pointer; justify-content:center; display:flex;">
            <ion-button fill="outline" color="light" style="padding-top: 10px; --border-radius: 40px; width:150px;">Marcar ruta</ion-button>
        `
        ).addTo(this.routeLayer);
        marker1.on('click', () => {
          const popupContent = document.getElementById(
            `popup-${this.selectedLocal.nombre}`
          );
          const popupRuta = document.getElementById(
            `popup-${this.selectedLocal.nombre}-ruta`
          );

          if (popupContent) {
            L.DomEvent.on(popupContent, 'click', () => this.detalle(this.selectedLocal));
          }
          if (popupRuta) {
            L.DomEvent.on(popupRuta, 'click', () => this.selectRuta(this.selectedLocal));
          }
        });
      }
    });
    if (hasta != '') {
      this.apiG.ruta(desde, hasta).subscribe((r) => {
        const route = r?.routes[0].geometry?.coordinates;
        const geojson: any = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route,
          },
        };
        const routeStyle = {
          //color: '#FF0055',
          //color: '#1AE8F2',
          color: '#7DDCD3',
          weight: 8,
          opacity: 0.7,
        };
        const geoRuta = L.geoJSON(geojson, { style: routeStyle });
        geoRuta.addTo(this.routeLayer);
      });
      this.map.flyTo([this.lat, this.lng], 17, {
        animate: true,
        duration: 0.5,
      });

      //////// BOTON ELIMINAR RUTA
      const botonEliminar = L.Control.extend({
        options: {
          position: 'topleft',
        },
        onAdd: (map: L.Map) => {
          const container = L.DomUtil.create(
            'div',
            'leaflet-bar leaflet-control leaflet-control-custom'
          );
          container.style.backgroundColor = 'white';
          container.style.width = '35px';
          container.style.height = '35px';
          container.style.cursor = 'pointer';
          container.style.display = 'flex';
          container.style.alignItems = 'center';
          container.style.justifyContent = 'center';
          const img = L.DomUtil.create('img', 'custom-icon', container);
          //img.src = 'https://brandeps.com/icon-download/C/Cross-circle-icon-vector-01.svg';
          img.src = 'https://svgsilh.com/svg/31226.svg';
          img.style.width = '80%';
          img.style.height = '80%';

          container.onclick = () => {
            this.clearRuta();
          };

          return container;
        },
      });

      if (!this.botonEliminarControl) {
        this.botonEliminarControl = new botonEliminar();
        this.map.addControl(this.botonEliminarControl);
      }
    }
  }

  handleRefresh(event:any) {
    setTimeout(() => { 
      this.getLocales();
      event.target.complete();
    }, 1000);
  }
}
