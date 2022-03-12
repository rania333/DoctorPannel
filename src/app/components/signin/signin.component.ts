import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AuthDialogComponent } from '../auth-dialog/auth-dialog.component';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  hide = true;
  signinForm: FormGroup;
  isSigned= false;
  currentID: string='';
  constructor(private _formBuilder: FormBuilder, private _dialog:MatDialog,
    private authSer: AuthService, private _router: Router,
    private _snackbar: MatSnackBar) {
      this.signinForm = this._formBuilder.group({
        email: ['', [Validators.required]],
        pass: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
  }

  async onSignin(email: string, pass: string) {
    this.authSer.signIn(email, pass)
    .then(user => {
      console.log(user);
    })
    .catch(err => {
      console.log(err);
    })




  }

  hasErr(control: string, err: string): boolean {
    if((this.signinForm.controls[control].dirty) &&
      (this.signinForm.controls[control].invalid) &&
      (this.signinForm.controls[control].errors?.[err])) {
        return true
      } else {
        return false
      }
  }

}
