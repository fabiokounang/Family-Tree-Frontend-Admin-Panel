import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AdminInterface } from 'src/app/interfaces/admin.interface';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loader: boolean = false;
  loginForm: FormGroup = new FormGroup({});
  eye: string = 'visibility';
  type: string = 'password';
  marga: string = '';

  constructor (private apiService: ApiService, private router: Router, private meta: Meta) { }

  ngOnInit(): void {
    this.marga = this.meta.getTag('name=marga')?.content || '';
    this.loginForm = new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.maxLength(30)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)])
    });
  }

  onLogin () {
    this.loader = true;
    this.apiService.connection('POST', 'master-signin', this.loginForm.value).subscribe({
      next: (response: AdminInterface) => {
        this.apiService.saveToLocalStorage(response);
        this.router.navigate(['/home', 'admin']);
      },
      error: ({ error }: HttpErrorResponse) => {
        this.loader = false;
        this.apiService.processErrorHttp(!error.error ? error : error.error);
      },
      complete: () => {
        this.loader = false;
      }
    });
  }

  onSetVisibility () {
    this.eye = this.eye === 'visibility_off' ? 'visibility' : 'visibility_off';
    this.type = this.eye === 'visibility_off' ? 'text' : 'password';
  }

}
