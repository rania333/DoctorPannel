import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { confirmPassValidator } from 'src/app/validators/confirmPass';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  hide = true;
  signupForm: FormGroup;
  isSigned = false;
  constructor(private _formBuilder: FormBuilder, private _snackbar:MatSnackBar,
              private authSer: AuthService) {
    this.signupForm = this._formBuilder.group({
      Name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      nameInArabic: ['', [Validators.required, Validators.pattern('^[\u0621-\u064A\u0660-\u0669 ]+$')]],
      email: ['', [Validators.required ,Validators.email]],
      pass: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]],
      pass2: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]],
      phone: ['', [Validators.required, Validators.pattern('^(01)[0-2][0-9]{8}$')]]
    }, {validators: [confirmPassValidator]});
  }

  ngOnInit(): void {
    if(localStorage.getItem('user') !== null) {
      this.isSigned = true;
    } else {
      this.isSigned = false;
    }
  }

  async onSignup(email: string, pass: string, phone:string, Name: string, nameInArabic: String) {
    await this.authSer.signUp(email, pass)
    .then(done => {
      //add to user collection
      this.authSer.addUser({Name,nameInArabic, email, phone})
      .then(done => {
        if(this.authSer.isLoggedIn) {
          this.isSigned = true;
        }
      });
    }).catch(err => {
      console.log(err.message);
    })
  }



  hasErr(control: string, err: string): boolean {
    if((this.signupForm.controls[control].dirty) &&
      (this.signupForm.controls[control].invalid) &&
      (this.signupForm.controls[control].errors?.[err])) {
        return true
      } else {
        return false
      }
  }

}
