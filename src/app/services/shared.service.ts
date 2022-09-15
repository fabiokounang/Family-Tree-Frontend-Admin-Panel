import { Injectable } from "@angular/core";
import { HttpRequest, HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import HttpList from '../utils/http-list';
import { Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})

export class SharedService {
  private roleAdmin: any[] = [
    {id: 1, name: 'Superadmin'},
    {id: 2, name: 'Admin'}
  ];

  private statusAdmin: any[] = [
    {id: 1, name: 'Active'},
    {id: 2, name: 'Not Active'}
  ];

  errGeneral: string = 'Something went wrong, please try again';

  constructor (private httpClient: HttpClient, private snack: MatSnackBar, private meta: Meta) {}

  getRoleAdmin () {
    return this.roleAdmin;
  }

  getStatusAdmin () {
    return this.statusAdmin;
  }

  async callSnack (text: string, action: string) {
    this.snack.open(text, action, {
      duration: 3000
    });
  }
}
