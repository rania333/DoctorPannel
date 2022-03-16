import { ActivatedRoute, Router } from '@angular/router';
import { CursorError } from '@angular/compiler/src/ml_parser/lexer';
import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthDialogComponent } from '../components/auth-dialog/auth-dialog.component';
import { DialogComponent } from '../components/dialog/dialog.component';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  private isLoggedBehaviour: BehaviorSubject<boolean>;
  constructor(private _auth:AngularFireAuth,
              private _firestore: AngularFirestore,
              private _snackbar: MatSnackBar,
              private _router: Router,
              private _dialog: MatDialog) {
    this.isLoggedBehaviour = new BehaviorSubject<boolean>(this.isLogged);
  }
  async signIn (email: string, pass: string) {
    return this._auth.signInWithEmailAndPassword(email, pass)
    .then(res => {
      this.isLoggedIn = true;
      localStorage.setItem("user", JSON.stringify(res.user));
      return this.getUserByEmail(email)
    })
    .then(user => {
      //check status
      const userData:any = user;
      if(userData && userData.status == 'pending') {
        // open Dialog
        this._dialog.open(DialogComponent)
      } else {
        //open snackbar
        this._snackbar.open("you're signedIn successfully",
        'close', {
              duration: 5000
        });
        this.isLoggedBehaviour.next(true);
        //redirect
        this._router.navigate(['/profile', userData.id]);
      }

    })
    .catch(err => {
      this._snackbar.open(err.message, 'close', {
        duration: 5000
      })
    })
  }

  async signUp (email: string, pass: string) {
      await this._auth.createUserWithEmailAndPassword(email, pass)
      .then(res => {
        this.isLoggedIn = true;
        localStorage.setItem("user", JSON.stringify(res.user));
        //open snackbar
        this._snackbar.open('The admin will contact with you to complete your peofile and to be able to login!',
        'close', {
              duration: 10000
        });
      })
      .catch(err => {
        this._snackbar.open(err.message, 'close', {
        duration: 5000
      })
    })
  }

  logout() {
    this._auth.signOut();
    this.isLoggedBehaviour.next(false);
    localStorage.removeItem('user');
    this._router.navigate(['/auth']);
  }

  //prop to use in guard
  get isLogged(): boolean {
    let isLogged;
    if(localStorage.getItem('user')) {
      isLogged = true;
    } else {
      isLogged = false
    }
    return isLogged;
  }

  addUser(data: any) {
    const currentUID = localStorage.getItem('user') ? localStorage.getItem('user') : null;
    const jsonData = JSON.parse(currentUID!);
    return this._firestore.collection('/Doctors_Collection/WOB3F9GigX8UX0O1v8zE/GeneralDoctors')
    .doc(jsonData.uid).set({
      "Name": data.Name,
      "email": data.email,
      "phone": data.phone,
      "status": "pending",
      "id": jsonData.uid, //need in redirect profile/id
      "Image": "https://firebasestorage.googleapis.com/v0/b/vezeeta-website-db.appspot.com/o/DoctorCall%2Fdownload.png?alt=media&token=541333e3-c6e1-41ba-b296-c1a9dcb5920e"
    })
    .then(res => {
      console.log('res', res);
    })
    .catch(err => {
      console.log('err',err.message);

    })
  }

  getUser(id: string) {
    let userData = this._firestore.collection('/Doctors_Collection/WOB3F9GigX8UX0O1v8zE/GeneralDoctors').doc(id)
    .get();
    return userData.toPromise()
  }

  async getUserByEmail(email: string) {
    let result;
    try {
      let user = await this._firestore.collection('/Doctors_Collection/WOB3F9GigX8UX0O1v8zE/GeneralDoctors',
      (ref) => ref.where('email', "==" , email)).get().toPromise();
      let userDate = user?.docs[0].data();
      result = userDate;
    } catch(err) {
      console.log('from err', err);
    }
    return result
  }

  EditProfile(id: string, data:any) {
    let userData = this._firestore.collection('/Doctors_Collection/WOB3F9GigX8UX0O1v8zE/GeneralDoctors').doc(id)
    .update(data);
    userData.then(res => {
      console.log('res', res);
      this._snackbar.open('Your data is updated successfully',
      'close', {
        duration: 5000
      })
    })
    .catch(err => {
      this._snackbar.open(err,
      'close', {
        duration: 5000
      })
    })
  }
}
