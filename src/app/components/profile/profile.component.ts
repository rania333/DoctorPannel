import { IDoctor } from './../../viewModels/idoctor';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { async } from '@angular/core/testing';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import 'ng2-validation';
import { AngularFireStorage } from '@angular/fire/compat/storage';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentID: string = '';
  userData: IDoctor = {} as IDoctor;
  selectedImg!: File;
  userProfile = new FormGroup({});
  constructor(private _activatedRoute: ActivatedRoute,
        private authSer: AuthService, private _builder: FormBuilder,
        private _storage:AngularFireStorage) { }

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe( async params => {
      let id = params.get('id');
      this.currentID = id!;
      const user =  await this.authSer.getUser(id!);
      const myData:any = user?.data();
      this.userData = myData;
      //set values to input to enable update btn without any changes
      this.userProfile.controls['Information'].setValue(this.userData.Information);
      this.userProfile.controls['InformationInArabic'].setValue(this.userData.InformationInArabic);
      this.userProfile.controls['address'].setValue(this.userData.address);
      this.userProfile.controls['addressAR'].setValue(this.userData.addressAR);
      this.userProfile.controls['Image'].setValue(this.userData.Image);
    })
    //handle form
    this.userProfile = this._builder.group({
      Information: ['', [Validators.minLength(5), Validators.pattern('^[a-zA-Z ]+$')]],
      InformationInArabic: ['', [Validators.minLength(5), Validators.pattern('^[\u0621-\u064A\u0660-\u0669 ]+$')]],
      address: ['', [Validators.pattern('^[1-9]{1,}\\s[a-zA-Z]{3,},\\s[a-zA-Z]{3,}$')]],
      addressAR: ['',],
      //4 elnoha str, cairo
      Image: [''],
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


  preview(event: any) {
    this.selectedImg = event.target.files[0];
  }

  EditProfile() {
    if(!this.selectedImg) {
      let data = this.userProfile.value;
      console.log('my data', data);
      this.authSer.EditProfile(this.currentID, {...data});
    } else {
      this._storage.ref(`/DoctorCall/${this.selectedImg?.name}`)
      .put(this.selectedImg).snapshotChanges().subscribe(data => {
        data?.ref.getDownloadURL().then(ref => {
          let data = this.userProfile.value;
          console.log('my data', data);
          this.authSer.EditProfile(this.currentID, {...data, Image: ref});
        })
      })
    }

    //set values to input to enable update btn without any changes
    // this.userProfile.controls['Information'].setValue('');
    // this.userProfile.controls['InformationInArabic'].setValue('');
    // this.userProfile.controls['address'].setValue('');
    // this.userProfile.controls['addressAR'].setValue('');
    // this.userProfile.controls['Image'].setValue('');
  }
}


