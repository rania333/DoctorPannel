import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss']
})
export class AuthDialogComponent implements OnInit {

  constructor(private _router:Router,
    private _dialogRef: MatDialogRef<AuthDialogComponent>,) { }

  ngOnInit(): void {
  }

  Signup() {
    this._router.navigate(['/auth']);
    this._dialogRef.close();
  }

}
