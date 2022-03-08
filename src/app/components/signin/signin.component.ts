import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
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
    private authSer: AuthService, private _router: Router) {
      this.signinForm = this._formBuilder.group({
        email: ['', [Validators.required]],
        pass: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
  }

  async onSignin(email: string, pass: string) {
    //get id from local storage
    const currentUID = localStorage.getItem('user') ? localStorage.getItem('user') : null;
    const jsonData = JSON.parse(currentUID!);
    this.authSer.getUser(jsonData.uid).subscribe(data => {
      this.currentID = data.id; //to use it in redirect
      const realData:any = data.data();
      if(realData.status == 'pending') {
        this._dialog.open(DialogComponent, {
          width: '350px'
        });
      } else {
        this.authSer.signIn(email, pass)
        .then(data => {
          if(this.authSer.isLoggedIn) {
            this.isSigned = true
          }
          //redirect
          this._router.navigate(['/profile', this.currentID])
        })
        .catch(err => {
          console.log(err);
        })
      }
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
