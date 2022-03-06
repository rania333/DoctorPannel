import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  hide = true;
  signinForm: FormGroup;
  constructor(private _formBuilder: FormBuilder,
    private authSer: AuthService) {
      this.signinForm = this._formBuilder.group({
        email: ['', [Validators.required]],
        pass: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
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
