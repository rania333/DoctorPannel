import { SigninComponent } from './components/signin/signin.component';
import { AuthComponent } from './components/auth/auth.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: "", redirectTo: "/auth", pathMatch:"full"},
  {path:"auth", component: AuthComponent},
  {path: "login", component: SigninComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
