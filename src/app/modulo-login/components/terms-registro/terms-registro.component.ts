import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2'
import { IonicModule } from '@ionic/angular';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-terms-registro',
  imports: [IonicModule, MatDialogModule, MatInputModule, MatSelectModule, MatSliderModule,MatInputModule, MatDividerModule, MatButtonModule, MatIconModule, FormsModule, MatCheckboxModule],
  templateUrl: './terms-registro.component.html',
  styleUrls: ['./terms-registro.component.scss'],
  standalone: true,
})
export class TermsRegistroComponent  implements OnInit {

  constructor(
    private router : Router,
  ) {}

  ngOnInit() {}

  okBtn(){
    const navigationExtras: NavigationExtras = {
      state: {
        id: 123456
      }
    };
    this.router.navigate(['/tabs/tab2'], navigationExtras);
    Swal.fire({
      toast: true,
      title: "Bienvenido!",
      icon: "success",
      timer: 2500,
      showConfirmButton: false,
      position: 'bottom',
      width: '60%',
      //color: '#FFFFFF',
      //background: '#00000090',
    });
  }

  checkedBtn : boolean = false;

  changeEvent(event:any){
    if(event.value){
      this.checkedBtn = false;
    }else{
      this.checkedBtn = true;
    }
  }

}