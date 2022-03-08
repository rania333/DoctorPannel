import { IDoctor } from './../../viewModels/idoctor';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentID: string = '';
  userData: any = {} as any;
  constructor(private _activatedRoute: ActivatedRoute,
        private authSer: AuthService) { }

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe(params => {
      let id = params.get('id');
      this.authSer.getUser(id!).subscribe(data => {
        const myData: any = data.data();
        this.userData = {
          name: myData.name,
          email: myData.email,
          phone: myData.phone,
          city: myData.city,
          dpt: myData.dpt,
          title: myData.title,
          price: myData.price,
          nationalID: myData.nationalID,
          DOB: myData.nationalID,
        }
      })
    })
  }

}
function data(data: any, arg1: (IDoctor: any) => void) {
  throw new Error('Function not implemented.');
}

