import { IDoctor } from './../../viewModels/idoctor';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { async } from '@angular/core/testing';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import 'ng2-validation';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentID: string = '';
  userData: IDoctor = {} as IDoctor;

  test:IDoctor = {
    id: '454544',
    name: 'rania',
    nameAR: 'رانيا',
    email: 'rania@r.com',
    phone: '01123525788',
    status:'complete',
    city:'cairo',
    cityAR: 'القاهرة',
    area: 'maadi',
    areaAR: 'المعادى',
    dpt:'atfal',
    dptAR: 'اطفال',
    title: 'doctor',
    titleAR:'اطفال',
    price: '500',
    nationalID: '29906212568459',
  }
  userProfile = new FormGroup({});
  constructor(private _activatedRoute: ActivatedRoute,
        private authSer: AuthService, private _builder: FormBuilder) { }

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe( async params => {
      let id = params.get('id');
      this.currentID = id!;
    const user =  await this.authSer.getUser(id!);
      const myData:any = user?.data();
      this.userData = myData;
      //set values to input to enable update btn without any changes
      this.userProfile.controls['BIO'].setValue(this.userData.BIO);
      this.userProfile.controls['BIOAR'].setValue(this.userData.BIOAR);
      this.userProfile.controls['address'].setValue(this.userData.address);
      this.userProfile.controls['addressAR'].setValue(this.userData.addressAR);
      this.userProfile.controls['img'].setValue(this.userData.img);
    })
    //handle form
    this.userProfile = this._builder.group({
      BIO: ['', [Validators.minLength(5), Validators.pattern('^[a-zA-Z ]+$')]],
      BIOAR: ['', [Validators.minLength(5), Validators.pattern('^[\u0621-\u064A\u0660-\u0669 ]+$')]],
      address: ['', [Validators.pattern('^[1-9]{1,}\\s[a-zA-Z]{3,},\\s[a-zA-Z]{3,}$')]],
      addressAR: ['',],
      //4 elnoha str, cairo
      img: [''],
    })
  }

  hasErr(control: string, err: string): boolean {
    if((this.userProfile.controls[control].dirty) &&
      (this.userProfile.controls[control].invalid) &&
      (this.userProfile.controls[control].errors?.[err])) {
        return true
      } else {
        return false
      }
  }

  get Gender(): string {
    return this.userProfile.get('gender')?.value;
  }

  EditProfile() {
    let data = this.userProfile.value;
    console.log('data', data);
    this.authSer.EditProfile(this.currentID, {...data});
    //set values to input to enable update btn without any changes
    this.userProfile.controls['BIO'].setValue('');
    this.userProfile.controls['BIOAR'].setValue('');
    this.userProfile.controls['address'].setValue('');
    this.userProfile.controls['addressAR'].setValue('');
    this.userProfile.controls['img'].setValue('');
  }
}


