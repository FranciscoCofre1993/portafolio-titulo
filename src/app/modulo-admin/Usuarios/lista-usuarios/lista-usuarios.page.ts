import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { ApiDjangoService } from 'src/app/services/api-django.service';
import { ConfirmationDeleteDialogComponent } from '../components/confirmation-delete-dialog/confirmation-delete-dialog.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.page.html',
  styleUrls: ['./lista-usuarios.page.scss'],
})
export class ListaUsuariosPage implements OnInit {
  lstUsuarios: any[]=[];
  lstPerfil: any[]=[];
  showDeleteButtons: boolean = false;

  constructor(
    private api: ApiDjangoService,
    private router:Router,
    private dialog: MatDialog
  ) { }

  ionViewWillEnter(){
    this.getUsuarios()
    this.getPerfil()
  }

  ngOnInit() {
    this.getUsuarios()
    this.getPerfil()
  }

  getUsuarios(){
    this.api.get("Usuario").subscribe((usuarios)=>{
      this.lstUsuarios = usuarios
      this.lstUsuarios.sort((a, b) => b.id - a.id);
    });
  }

  getPerfil(){
    this.api.get("Perfil").subscribe((perfil)=>{
      this.lstPerfil = perfil
    });
  }

  getPerfilNameById(id: number): string {
    const perfil = this.lstPerfil.find(p => p.id === id);
    return perfil ? perfil.nombre : 'Desconocido';
  }
  
  goAgregarUser() {
    this.router.navigate(['/tabs-admin/lista-usuarios/formulario']);
  }

  detalle(item:any){
    const navigationExtras: NavigationExtras = {
      state: {
        item: item,
        paginaAnterior:'/tabs-admin/lista-usuarios'
      }
    };
    this.router.navigate(['/tabs-admin/lista-usuarios/modificar'], navigationExtras);
  }

  toggleAllDeleteButtons() {
    this.showDeleteButtons = !this.showDeleteButtons;
  }

  openConfirmationDialog(item: any, event: Event): void {
    event.stopPropagation(); 

    const dialogRef = this.dialog.open(ConfirmationDeleteDialogComponent, {disableClose:true, panelClass: 'custom-container'});

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteUser(item);
        Swal.fire({
          toast: true,
          title: "Usuario Eliminado!",
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

  deleteUser(item: any): void {
    this.api.delete("Usuario", item.id).subscribe((response: any) => {

      this.getUsuarios();
    });
  }

  handleRefresh(event:any) {
    setTimeout(() => { 
      this.getUsuarios()
      event.target.complete();
    }, 1000);
  }

  fabOpen = false;

  toggleFab() {
    this.fabOpen = !this.fabOpen;
  }
}
