import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  constructor() { }

  @Output() filtrar: EventEmitter<boolean> = new EventEmitter();
  @Output() marcarRuta: EventEmitter<boolean> = new EventEmitter();
  @Output() listarLocales: EventEmitter<boolean> = new EventEmitter();
  @Output() recargarLocal: EventEmitter<boolean> = new EventEmitter();
  @Output() eliminarFiltros: EventEmitter<boolean> = new EventEmitter();
  @Output() RecargarProductos: EventEmitter<boolean> = new EventEmitter();
  @Output() actualizarLocal: EventEmitter<boolean> = new EventEmitter();
  @Output() actualizarUsuario: EventEmitter<boolean> = new EventEmitter();
  @Output() actualizarComentarios: EventEmitter<boolean> = new EventEmitter();
  @Output() filtroCargado: EventEmitter<boolean> = new EventEmitter();

}
