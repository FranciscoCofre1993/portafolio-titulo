import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { ApiDjangoService } from 'src/app/services/api-django.service';
import { ConfDeleteLocalDialogComponent } from '../components/conf-delete-local-dialog/conf-delete-local-dialog.component'
import Swal from 'sweetalert2';
import { EventosService } from 'src/app/services/eventos.service';

@Component({
  selector: 'app-lista-locales',
  templateUrl: './lista-locales.page.html',
  styleUrls: ['./lista-locales.page.scss'],
})
export class ListaLocalesPage implements OnInit {
  lstLocales: any[]=[];
  datosUsuario:any;

  showDeleteButtons: boolean = false;
  showAddButtons: boolean = false;
  

  constructor(
    private api: ApiDjangoService,
    private router:Router,
    private dialog: MatDialog,
    private eventos: EventosService,
  ) { 
    eventos.listarLocales.subscribe((r)=>{
      this.getLocales()
    })
  }

  ionViewWillEnter(){
    this.getLocales()
  }

  ngOnInit() {
    this.datosUsuario = JSON.parse(localStorage.getItem('usuarioActivo') || '{}');
    this.getLocales()
  }

  getLocales(){
    this.api.get("Locales").subscribe((locales)=>{
      this.lstLocales = locales
      this.lstLocales.sort((a, b) => b.id - a.id);
    });
  }

  detalle(item:any){
    const navigationExtras: NavigationExtras = {
      state: {
        item: item,
        paginaAnterior:'/tabs-admin/lista-locales'
      }
    };
    this.eventos.recargarLocal.emit(true);
    this.router.navigate(['/tabs-admin/lista-locales/modificar-locales'], navigationExtras);
  }

  detalle2(item:any){
    const navigationExtras: NavigationExtras = {
      state: {
        item: item,
        paginaAnterior:'/tabs-admin/lista-locales'
      }
    };
    this.eventos.actualizarLocal.emit(item);
    this.router.navigate(['/tabs-admin/lista-productos'], navigationExtras);
  }

  toggleAllDeleteButtons() {
    this.showDeleteButtons = !this.showDeleteButtons;
  }

  toggleAllAddButtons() {
    this.showAddButtons = !this.showAddButtons;
  }

  openConfirmationDialog(item: any, event: Event): void {
    event.stopPropagation(); 

    const dialogRef = this.dialog.open(ConfDeleteLocalDialogComponent, {disableClose:true, panelClass: 'custom-container'});

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteLocal(item);
        Swal.fire({
          toast: true,
          title: "Local Eliminado!",
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

  goAgregarLocal() {
    this.router.navigate(['/tabs-admin/lista-locales/agregar-locales']);
  }

  deleteLocal(item: any): void {
    this.api.delete("Locales", item.id).subscribe((response: any) => {
      let data = {
        descripcion: "Local " +  item.nombre + " eliminado",
        usuario: this.datosUsuario.id,
        fecha: new Date(),
      }
      this.api.post("RegistroCambios", data).subscribe((r)=>{
      })
      this.getLocales();
    });
  }

  handleRefresh(event:any) {
    setTimeout(() => { 
      this.getLocales()
      event.target.complete();
    }, 1000);
  }

  async InputBuscador(evento:any){
    let lstOriginal = [...this.lstLocales]
    const nombreInput = evento.target.value.toLowerCase();
    lstOriginal = lstOriginal.filter((local)=> local.nombre.toLowerCase().includes(nombreInput))
    this.lstLocales = lstOriginal
    if (nombreInput == "") {
      this.getLocales()
    }
  }

  fabOpen = false;

  toggleFab() {
    this.fabOpen = !this.fabOpen;
  }

}
