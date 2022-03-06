import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(private _router: Router) { }

  ngOnInit(): void {
  }

  goToLogin() {
    this._router.navigate(['/login'])
  }

}
