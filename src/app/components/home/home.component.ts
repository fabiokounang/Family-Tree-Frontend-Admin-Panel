import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';
// import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  modeSide: any = 'side';
  open: boolean = true;
  userRole: any = null;
  username: string = '';

  constructor (private router: Router, private apiService: ApiService, private sharedService: SharedService) {}

  ngOnInit() {
    this.onResize();
    this.userRole = this.apiService.getLocalStorageRole();
    this.username = localStorage.getItem('username') || '';
  }


  onToggle (sidenav: MatSidenav) {
    if (window.innerWidth <= 992) sidenav.toggle();
  }

  onToggleButton (sidenav: MatSidenav) {
    sidenav.toggle();
  }

  onLogout (sidenav: MatSidenav) {
    this.apiService.removeLocalStorage();
    this.router.navigate(['/'])
  }

  onResize() {
    this.modeSide = window.innerWidth <= 992 ? 'over' : 'side';
    this.open = window.innerWidth <= 992 ? false : true;
  }

  onChangePassword () {}
}
