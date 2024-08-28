import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, NgModel, } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IonicModule } from '@ionic/angular';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { EventosService } from 'src/app/services/eventos.service';
import { ApiDjangoService } from 'src/app/services/api-django.service';
import { Tab1Page } from '../../Mapa/tab1.page';

@Component({
  selector: 'app-frm-filtros',
  imports: [
    IonicModule,
    CommonModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatInputModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './frm-filtros.component.html',
  styleUrls: ['./frm-filtros.component.scss'],
  standalone: true,
})
export class FrmFiltrosComponent implements OnInit {
  str = '';
  nan=NaN;
  rango: any;
  rangoText: string = '1km';
  rangoNum: number = 1;
  filtrosStorage: any;
  precioMaximo: number = 0;
  precioMinimo: number = 0;
  tipo_producto: number = 0;
  tipo_local: number = 0;
  lstTipoProducto: any[] = [];
  lstTipoLocal: any[] = [];
  cargandoFiltro:boolean = false;
  paginaActual: any;

  constructor(
    public dialog: MatDialog,
    private eventos: EventosService,
    private api: ApiDjangoService
  ) {
    eventos.filtroCargado.subscribe((r)=>{
      this.cargandoFiltro = false
    })
  }

  ngOnInit() {
    this.setFiltrosActuales();
    this.getTipoLocal();
    this.getTipoProducto();
    this.paginaActual = localStorage.getItem('paginaActual');
  }

  getTipoProducto() {
    this.api.get('TipoProducto').subscribe((r: any) => {
      this.lstTipoProducto = [...r];
      this.lstTipoProducto.push({
        id: 0,
        nombre: "Todos",
      })
      this.lstTipoProducto.sort((a,b)=> a.id - b.id)
    });
    
  }

  getTipoLocal() {
    this.api.get('TipoLocal').subscribe((r: any) => {
      this.lstTipoLocal = [...r];

      this.lstTipoLocal.push({
        id: 0,
        nombre: "todos",
      })
      this.lstTipoLocal.sort((a,b)=> a.id - b.id)

    });
  }

  formatLabel(value: number): string {
    if (value >= 5) {
      return '<' + value + 'km';
    }
    return value + 'km';
  }
  hide = true;

  setFiltrosActuales() {
    this.filtrosStorage = JSON.parse(localStorage.getItem('filtros') || '{}');
    if (this.filtrosStorage) {
      this.tipo_producto = this.filtrosStorage.tipo_producto;
      this.precioMinimo = this.filtrosStorage.precioMinimo;
      this.precioMaximo = this.filtrosStorage.precioMaximo;
    }
  }

  eliminarFiltros() {
    localStorage.setItem(
      'filtros',
      JSON.stringify({
        tipo_producto: null,
        precioMinimo: null,
        precioMaximo: null,
        rango: null,
      })
    );
    this.eventos.eliminarFiltros.emit(true);
  }

  setRango(event: any) {
    this.rangoText = event.srcElement.ariaValueText;
    this.rangoText = this.rangoText.substring(0, this.rangoText.length - 2);
    if (this.rangoText == '<5') {
      this.rangoText = '5';
    }
    if (this.rangoText == '0') {
      this.rangoText = '1';
    }
    this.rangoNum = parseInt(this.rangoText);
  }

  buscar() {
    this.cargandoFiltro = true
    localStorage.setItem(
      'filtros',
      JSON.stringify({
        tipo_producto: this.tipo_producto,
        precioMinimo: this.precioMinimo,
        precioMaximo: this.precioMaximo,
        rango: this.rangoNum,
      })
    );
    this.eventos.filtrar.emit(true);
  }
}
