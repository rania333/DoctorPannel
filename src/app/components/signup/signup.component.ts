import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  constructor(private _formBuilder: FormBuilder,
              private authSer: AuthService) {
    this.signupForm = this._formBuilder.group({
      name: ['', [Validators.required]],
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

  async onSignup(email: string, pass: string, phone:string, name: string) {
    await this.authSer.signUp(email, pass);
    //add to user collection
    this.authSer.addUser({name, email, phone});
    if(this.authSer.isLoggedIn) {
      this.isSigned = true;
    }
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
