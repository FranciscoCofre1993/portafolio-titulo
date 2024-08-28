import { Component, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { EventosService } from './services/eventos.service';
import { AlertController, IonRouterOutlet, Platform, ToastController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  datosUsuario : any
  tap = 0;

  constructor(
 private router : Router ,
 private eventos :EventosService,
 private platform: Platform,
 private toastController: ToastController,
 private alertCtrl: AlertController,
 @Optional () private routerOutlet?: IonRouterOutlet,
  ) {
    this.datosUsuario = JSON.parse(localStorage.getItem('usuarioActivo') || '{}');
    console.log("datos usuario: ",this.datosUsuario);
    if (this.datosUsuario.perfil == 1 || this.datosUsuario.perfil == 4 ) {
      
      this.eventos.actualizarUsuario.emit(true)
      router.navigate(['tabs/tab2'])
    }
    if (this.datosUsuario.perfil == 2) {
      this.eventos.actualizarUsuario.emit(true)

      router.navigate(['/tabs-admin'])
    }
    this.platform.ready().then(() => {
      this.exitAppOnAlert();
    })
  }


  exitAppOnAlert() {
    if(Capacitor.getPlatform() == 'android') {
      this.platform.backButton.subscribeWithPriority(10, async() => {
        if (!this.routerOutlet?.canGoBack()) {
          this.alertExit();
        }
      });
    }
  }

  async alertExit() {
    console.log('alert');
    const alert = await this.alertCtrl.create({
      header: 'Salir de la App',
      message: '¿Estás seguro que deseas salir de la app?',
      buttons: [
        {
          text: 'SI',
          role: 'confirm',
          handler: () => { App.exitApp(); }
        },
        {
          text: 'NO',
          role: 'cancel',
        }
      ],
    });
    alert.present();
  }

}
