import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-form-add-admin',
  templateUrl: './form-add-admin.component.html',
  styleUrls: ['./form-add-admin.component.css']
})
export class FormAddAdminComponent implements OnInit {
  adminForm: FormGroup;
  loader: boolean = false;
  roles: any = [];
  status: any = [];
  eyePassword = 'visibility';
  typePassword = 'password';
  eyeConfirmPassword = 'visibility';
  typeConfirmPassword = 'password';
  adminRole: any = null;

  constructor (@Inject(MAT_DIALOG_DATA) private data: any, private sharedService: SharedService, private apiService: ApiService, private dialog: MatDialog, private dialogRef: MatDialogRef<any>) {}

  ngOnInit() {
    this.fillData();
    this.makeForm();
  }

  fillData () {
    this.roles = this.sharedService.getRoleAdmin();
    this.status = this.sharedService.getStatusAdmin();
  }

  makeForm () {
    this.adminForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      confirmation_password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      role: new FormControl(null, [Validators.required])
    });
  }

  onChangeRole (event) {
    this.adminRole = event.value;
    if (event.value === 2) this.adminForm.addControl('merchants', new FormControl(null, [Validators.required]));
    else this.adminForm.removeControl('merchants');
  }

  onCloseDialog () {
    this.dialogRef.close(false);
  }

  onAddAdmin () {    
    if (this.adminForm.valid) {
      this.loader = true;
      this.dialogRef.disableClose = true;
      this.adminForm.disable();
      this.apiService.connection('POST', 'master-admin-create', this.adminForm.value).subscribe({
        next: (response: any) => {
          this.dialogRef.close(true);
          this.apiService.callSnack('Success create admin', 'Close');
          this.loader = false;
        },
        error: ({error}: HttpErrorResponse) => {
          this.loader = false;
          this.dialogRef.close(true);
          this.apiService.processErrorHttp(error.error);
        }
      })
    } else {
      this.apiService.callSnack('Input not valid', 'Close');
    }
  }

  onToggle (eye, type) {
    this[eye] = this[eye] == 'visibility' ? 'visibility_off' : 'visibility';
    this[type] = this[type] == 'password' ? 'text' : 'password'; 
  }

}
