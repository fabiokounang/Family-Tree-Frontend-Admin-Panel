import { Injectable } from "@angular/core";
import { HttpRequest, HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import HttpList from '../utils/http-list';
import { Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private apiHttp: string = '';
  private subHttp: any = HttpList;

  errGeneral: string = 'Something went wrong, please try again';

  constructor (private httpClient: HttpClient, private snack: MatSnackBar, private meta: Meta) {
    this.apiHttp = this.meta.getTag('name=api')?.content || '';
  }

  connection(method: string, subHttp: string, data: any = {}, query: string = '', strData = '') {
    const url = this.apiHttp + this.subHttp[subHttp] + (strData ? '/' + strData : '') + '?' + query + '&time=' + new Date().getTime();
    // const req = new HttpRequest(method, url, data);
    return this.httpClient.post(url, data, { observe: 'body' });
  }

  saveToLocalStorage (data: any) {
    localStorage.setItem('_id', data._id);
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    localStorage.setItem('role', data.role);
    localStorage.setItem('status', data.status);
  }

  removeLocalStorage () {
    localStorage.removeItem('_id');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('status');
  }

  checkLocalStorage () {
    return localStorage.getItem('_id') && localStorage.getItem('token')&& localStorage.getItem('username') && localStorage.getItem('role') && localStorage.getItem('token');
  }

  getLocalStorageToken () {
    return localStorage.getItem('token');
  }

  getLocalStorageRole () {
    return localStorage.getItem('role');
  }

  getLocalStorageId () {
    return localStorage.getItem('_id');
  }

  processErrorHttp (error) {
    const errMsg = error ? error : this.errGeneral;
    this.callSnack(errMsg, 'Dismiss');    
  }

  async callSnack (text: string, action: string) {
    this.snack.open(text, action, {
      duration: 3000
    });
  }
}
