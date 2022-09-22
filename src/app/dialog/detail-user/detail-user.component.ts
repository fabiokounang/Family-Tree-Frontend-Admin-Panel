import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserInterface } from 'src/app/interfaces/user.interface';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-detail-user',
  templateUrl: './detail-user.component.html',
  styleUrls: ['./detail-user.component.css']
})
export class DetailUserComponent implements OnInit {
  loader: boolean = false;
  user: UserInterface = null;
  objectKeys = Object.keys;

  constructor (@Inject(MAT_DIALOG_DATA) private data: any, private apiService: ApiService, private dialogRef: MatDialogRef<any>) {}

  ngOnInit(): void {
    this.getOneUser();
  }

  getOneUser () {
    this.loader = true;
    this.apiService.connection('POST', 'master-user-detail', {}, '', this.data._id).subscribe({
      next: (response: UserInterface) => {
        this.user = response;
        delete this.user._id;
        delete this.user.created_at;
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

}
