import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog'
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: 'app-confirmation-delete-dialog',
  templateUrl: './confirmation-delete-dialog.component.html',
  styleUrls: ['./confirmation-delete-dialog.component.scss'],
  imports:[MatDialogModule, MatDividerModule],
  standalone: true,
})
export class ConfirmationDeleteDialogComponent  implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDeleteDialogComponent>,
  ) { }

  ngOnInit() {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close('confirm');
  }
}
