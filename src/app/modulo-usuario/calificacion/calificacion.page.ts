import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ApiDjangoService } from 'src/app/services/api-django.service';
import { EventosService } from 'src/app/services/eventos.service';

@Component({
  selector: 'app-calificacion',
  templateUrl: './calificacion.page.html',
  styleUrls: ['./calificacion.page.scss'],
})
export class CalificacionPage implements OnInit, OnDestroy {
  datosUsuario:any 
  selectedLocal:any
  paginaAnterior:any
  lstCalificacion:any[]=[]
  calificacionTotal:number = 0;
  calificacionForm:number = 0;
  comentario:string = '';
  evento : any
  lstUsuario: any[]=[];

  constructor(
    private router: Router,
    private api: ApiDjangoService,
    private eventos: EventosService,
  ) {
   this.evento = eventos.actualizarComentarios.subscribe((r)=>{
      this.getCalifiacion();
    })
   }

 ngOnDestroy(): void {
     this.evento.unsubscribe();
 }

  ngOnInit() {
    this.datosUsuario = JSON.parse(localStorage.getItem('usuarioActivo') || '{}');
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state) {
       this
       .selectedLocal = state['item'];
       this.paginaAnterior = state['paginaAnterior']
    }
    this.getCalifiacion()
    this.getUsuario()
  }

   getCalifiacion(){
    this.datosUsuario = JSON.parse(localStorage.getItem('usuarioActivo') || '{}');
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state) {
       this
       .selectedLocal = state['item'];
       this.paginaAnterior = state['paginaAnterior']
    }
    this.lstCalificacion = []
    this.calificacionTotal = 0
     this.api.get(`Calificacion`).subscribe((r:any)=>{
      let conteo = 0
      if (r) {
        this.lstCalificacion = r;
      this.lstCalificacion = this.lstCalificacion.filter(calificacion=> calificacion.local == this.selectedLocal.id)
      this.lstCalificacion.forEach(calificacion => {
        conteo = (conteo + calificacion.estrellas)
      });
      this.calificacionTotal = conteo / this.lstCalificacion.length
      }
      this.lstCalificacion.sort((a, b) => b.id - a.id);
      });
      
  }

  guardarCalificacion(){
    let data = {
      estrellas: this.calificacionForm,
      comentario: this.comentario,
      usuario: this.datosUsuario.id,
      local: this.selectedLocal.id
  }
  this.api.post(`Calificacion`, data).subscribe((r:any)=>{
    if (r) {
      this.getCalifiacion()
      this.getUsuario()
      this.calificacionForm = 0
      this.comentario = ''
    } else {
      
    }
  })

  }
  changeRating(evento:any){
    this.calificacionForm = evento 
  }

  backBtn(){
    this.router.navigate(['/tabs/tab2'])
  }

  handleRefresh(event:any) {
    setTimeout(() => { 
      this.getCalifiacion()
      event.target.complete();
    }, 1000);
  }

  irARegistro(){
    const navigationExtras: NavigationExtras = {
      state: {
        paginaAnterior:'/tabs/calificacion'
      }
    };
    this.router.navigate(['/registro'], navigationExtras);
  }

  getUsuario(){
    this.api.get("Usuario").subscribe((user)=>{
      this.lstUsuario = user
    });
  }

  getUserNameById(id: number): String {
    const user = this.lstUsuario.find(u => u.id === id);
    return user ? user.usuario : 'Desconocido';
  }
}
