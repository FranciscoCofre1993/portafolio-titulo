import { Component, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-conf-delete-producto-dialog',
  templateUrl: './conf-delete-producto-dialog.component.html',
  styleUrls: ['./conf-delete-producto-dialog.component.scss'],
  imports:[MatDialogModule, MatDividerModule],
  standalone: true,
})
export class ConfDeleteProductoDialogComponent  implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfDeleteProductoDialogComponent>,
  ) { }

  ngOnInit() {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close('confirm');
  }

}
