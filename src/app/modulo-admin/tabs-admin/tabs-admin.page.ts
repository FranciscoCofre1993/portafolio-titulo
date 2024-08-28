import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs-admin',
  templateUrl: './tabs-admin.page.html',
  styleUrls: ['./tabs-admin.page.scss'],
})

export class TabsAdminPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goListaUsers(){
    this.router.navigate(['/tabs-admin/lista-usuarios'])
  }

  goListaLocales(){
    this.router.navigate(['/tabs-admin/lista-locales'])
  }

  goPerfil(){
    this.router.navigate(['/tabs-admin/perfil'])
  }

}
