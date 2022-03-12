import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() userName = ''
  constructor(private authSer: AuthService) { }

  ngOnInit(): void {
  }

  logout(): void {
    this.authSer.logout();
  }

}
