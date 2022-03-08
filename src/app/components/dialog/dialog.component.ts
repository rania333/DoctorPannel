import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  constructor(private _dialogRef: MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
  }

  Cancel(): void {
    this._dialogRef.close();
  }

}
