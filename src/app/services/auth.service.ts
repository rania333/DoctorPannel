import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {AngularFirestore} from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  constructor(private _auth:AngularFireAuth,
              private _firestore: AngularFirestore) {
  }
  async signIn (email: string, pass: string) {
    await this._auth.signInWithEmailAndPassword(email, pass)
    .then(res => {
      this.isLoggedIn = true;
      localStorage.setItem("user", JSON.stringify(res.user));
    })
    .catch(err => {
      console.log(err);
    })
  }

  async signUp (email: string, pass: string) {
    await this._auth.createUserWithEmailAndPassword(email, pass)
    .then(res => {
      this.isLoggedIn = true;
      localStorage.setItem("user", JSON.stringify(res.user));
      //add to user collection
      console.log('from signup', res);
      return {
        "msg": "the admin will review your account and contact with you to complete your data"
      }
    })
    .catch(err => {
      console.log(err);
    })
  }

  logout() {
    this._auth.signOut()
    localStorage.removeItem('user');
  }

  addUser(data: any) {
    this._firestore.collection('users').doc().set({
      "name": data.name,
      "email": data.email,
      "phone": data.phone
    })
    .then(res => {
      console.log('res', res);
    })
    .catch(err => {
      console.log(err);
    })
  }

}
