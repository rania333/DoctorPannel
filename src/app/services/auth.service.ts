import { ActivatedRoute, Router } from '@angular/router';
import { CursorError } from '@angular/compiler/src/ml_parser/lexer';
import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  constructor(private _auth:AngularFireAuth,
              private _firestore: AngularFirestore,
              private _snackbar: MatSnackBar,
              private _router: Router) {
  }
  async signIn (email: string, pass: string) {
    return this._auth.signInWithEmailAndPassword(email, pass)
    .then(res => {
      this.isLoggedIn = true;
      localStorage.setItem("user", JSON.stringify(res.user));
      //open snackbar
      this._snackbar.open("you're signedIn successfully",
      'close', {
            duration: 5000
      });

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
    this._auth.signOut()
    localStorage.removeItem('user');
  }

  addUser(data: any) {
    const currentUID = localStorage.getItem('user') ? localStorage.getItem('user') : null;
    const jsonData = JSON.parse(currentUID!);
    return this._firestore.collection('users')
    .doc(jsonData.uid).set({
      "name": data.name,
      "email": data.email,
      "phone": data.phone,
      "status": "pending"
    })
    .then(res => {
      console.log('res', res);
    })
    .catch(err => {
      console.log('err',err.message);

    })
  }

  getUser(id: string) {
    let userData = this._firestore.collection('users').doc(id)
    .get();
    return userData
  }
}
