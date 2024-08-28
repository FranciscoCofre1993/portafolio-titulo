import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiDjangoService } from 'src/app/services/api-django.service';

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog.page.html',
  styleUrls: ['./changelog.page.scss'],
})
export class ChangelogPage implements OnInit {
  lstRegCambios: any[]=[];
  lstUsuario: any[]=[];

  constructor(
    private api: ApiDjangoService,
    private router:Router
  ) { }

  ngOnInit() {
    this.getRegistroCambios();
    this.getUsuario();
  }

  getRegistroCambios(){
    this.api.get("RegistroCambios").subscribe((reg)=>{
      this.lstRegCambios = reg
      this.lstRegCambios.sort((a, b) => b.id - a.id);
    });
  }

  getUsuario(){
    this.api.get("Usuario").subscribe((user)=>{
      this.lstUsuario = user
    });
  }

  getUserNameById(id: number): string {
    const user = this.lstUsuario.find(u => u.id === id);
    return user ? user.usuario : 'Desconocido';
  }

  goBack() {
    this.router.navigate(['tabs/tab2']);
  }
}
