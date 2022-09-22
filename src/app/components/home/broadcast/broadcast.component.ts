import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserInterface } from 'src/app/interfaces/user.interface';
import { UserPaginationInterface } from 'src/app/interfaces/userpagination.interface';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.css']
})
export class BroadcastComponent implements OnInit {
  broadcastForm: FormGroup;
  loader: boolean = false;
  users: UserInterface[] = [];

  constructor (private apiService: ApiService) { }

  ngOnInit(): void {
    this.getAllUser();
    this.makeForm();
  }

  getAllUser () {
    this.loader = true;
    const objGet = {
      filter: { status: 1 }
    }
    this.apiService.connection('POST', 'master-user', objGet).subscribe({
      next: (response: UserPaginationInterface) => {
        this.users = response.values;
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

  makeForm () {
    this.broadcastForm = new FormGroup({
      title: new FormControl(null, Validators.required),
      body: new FormControl(null, Validators.required),
      users: new FormControl(null, Validators.required)
    });
  }

  onBroadcast () {
    this.loader = true;
    this.apiService.connection('POST', 'master-broadcast-push', this.broadcastForm.value).subscribe({
      next: (response: UserPaginationInterface) => {
        this.apiService.callSnack('Success broadcast notification', 'Close');
        this.broadcastForm.reset();
        this.loader = false;
      }, 
      error: ({ error }: HttpErrorResponse) => {
        this.loader = false;
        this.apiService.processErrorHttp(!error.error ? error : error.error);
      }
    });
  }

}
