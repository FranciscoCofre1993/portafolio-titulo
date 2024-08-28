import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog'
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: 'app-conf-delete-local-dialog',
  templateUrl: './conf-delete-local-dialog.component.html',
  styleUrls: ['./conf-delete-local-dialog.component.scss'],
  imports:[MatDialogModule, MatDividerModule],
  standalone: true,
})
export class ConfDeleteLocalDialogComponent  implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfDeleteLocalDialogComponent>,
  ) { }

  ngOnInit() {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close('confirm');
  }

}
