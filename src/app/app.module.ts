import { AngularMaterialModule } from './modules/angular-material/angular-material.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProfileComponent } from './components/profile/profile.component';

import {AngularFireModule} from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AuthComponent } from './components/auth/auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogComponent } from './components/dialog/dialog.component';
import { AuthDialogComponent } from './components/auth-dialog/auth-dialog.component';
import { HeaderComponent } from './components/header/header.component';
import { BirthdayPipe } from './pipes/birthday.pipe';
import {AngularFireStorageModule} from '@angular/fire/compat/storage';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideFirebaseApp } from '@angular/fire/app';
import { initializeApp } from 'firebase/app';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';


@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    ProfileComponent,
    AuthComponent,
    DialogComponent,
    AuthDialogComponent,
    HeaderComponent,
    BirthdayPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    provideStorage(() => getStorage()),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    AngularFirestoreModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
