import { IDoctor } from './../../viewModels/idoctor';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import 'ng2-validation';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AnyARecord } from 'dns';
// import { setInterval } from 'timers';
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
  timeTable = new FormGroup({});
  doctorTimes = [];
  //to store booked times
  bookedTime:any = [];
  freeTime: any = [];
  newAppointments: any;
  currentDate = new Date()
  constructor(private _activatedRoute: ActivatedRoute,
        private authSer: AuthService, private _builder: FormBuilder,
        private _storage:AngularFireStorage) {
          this.newAppointments = [];
        }

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
    //handle timetable
    this.timeTable = this._builder.group({
      day: ['', [Validators.required]],
      from: ['', [Validators.required]],
      to: ['', [Validators.required]]
    });

    //get data
    this.authSer.getUser(this.currentID).then(data => {
      const times: any = data?.data();
      const myTimes = times.timeTables;
      myTimes && myTimes.map((singleDay: { hours: any[]; })=> {
        let data:any = singleDay
        singleDay.hours.map((time: { status: string; }) => {
          if(time.status != 'empty' && time.status != 'cancel') {
            this.bookedTime.push({...time,day:data.day, date:data.date})
          } else if(time.status == 'empty') {
            this.freeTime.push({...time,day:data.day, date:data.date});
          }
        })
      })
      console.log('my data', times.timeTables);
      console.log('booked', this.bookedTime);
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

  hasErr2(control: string, err: string): boolean {
    if((this.timeTable.controls[control].dirty) &&
      (this.timeTable.controls[control].invalid) &&
      (this.timeTable.controls[control].errors?.[err])) {
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

  updateTimetable() {
    //extract doctor data
    const day = new Date(this.timeTable.controls['day'].value).toString().split(" ")[0];
    const date = new Date(this.timeTable.controls['day'].value).toLocaleDateString(); //m/d/yyyy
    const from = this.timeTable.controls['from'].value;
    const to = this.timeTable.controls['to'].value;
    //assign time to date
    var setFromToDate = new Date(date).setHours(from.split(":")[0], from.split(":")[1]);
    var setToDate = new Date(date).setHours(to.split(":")[0], to.split(":")[1]);
    var fromHours = new Date(setFromToDate);
    var toHours = new Date(setToDate);
    const timeTables:any = {
      day: day,
      date: date,
      hours: []
    };
    var getCurrentTime2 = new Date(fromHours).getHours() + ':' +new Date(fromHours).getMinutes();
    var test = fromHours;
    while(test.getTime() <= toHours.getTime()) {
      timeTables.hours.push({hour: getCurrentTime2, status: 'empty'})
      test = new Date(test);
      test.setMinutes(test.getMinutes() + 30)
      getCurrentTime2 =new Date(test).getHours() + ':' +new Date(test).getMinutes();
    }

    //get current times
    const prevTimes = this.authSer.getUser(this.currentID).then(d => {
      var currentTimes:any = d?.data();
      // var prev = currentTimes.timeTables.push(timeTables);
      console.log(currentTimes.timeTables);
      var newTimes =  timeTables;
      // update
      this.authSer.EditProfile(this.currentID, {
        timeTables: currentTimes.timeTables ?[...currentTimes.timeTables, timeTables]: [timeTables]
      })
    })
  }

  Cancel(e: any) {
    //delete prev values
    this.newAppointments= [];
    //console.log('hello', e); //da kda obj feh date w day w hour w status
    this.authSer.getUser(this.currentID).then(data => {
      const actualData:any = data?.data();
      const times = actualData.timeTables;
      times.map((time: any) => {
        if(time.date === e.date) {
          time.hours.map((hour: { hour: any; }) => {
            if(hour.hour === e.hour) {
              const afterCancel = {
                hour: hour.hour,
                status: 'cancel'
              }
              //edit in array
              const newObj = {
                date: time.date,
                day: time.day,
                hours: time.hours.filter((oldHour: { hour: any; }) => oldHour.hour !== hour.hour)
              }
              newObj.hours.push(afterCancel);
              // console.log('crnt obj', time); //da obj kaml l b3dl feh
              // console.log('sec true', afterCancel);//new hour after edit
              // console.log('newObj', newObj);
              this.newAppointments.push(newObj)
            }

          })
        } else {
          this.newAppointments.push(time);
        }
      })
      //console.log('time', times);
      console.log('newAppointments2', this.newAppointments);
      //edit here
      this.authSer.EditProfile(this.currentID, {
        timeTables: this.newAppointments
      });
    })
    //console.log('newAppointments', this.newAppointments);
  }
}


