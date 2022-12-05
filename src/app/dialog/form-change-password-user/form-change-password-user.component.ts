import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-form-change-password-user',
  templateUrl: './form-change-password-user.component.html',
  styleUrls: ['./form-change-password-user.component.css']
})
export class FormChangePasswordUserComponent implements OnInit {

  changePasswordForm: FormGroup;
  loader: boolean = false;
  eyePassword = 'visibility';
  typePassword = 'password';
  eyeConfirmPassword = 'visibility';
  typeConfirmPassword = 'password';

  constructor (@Inject(MAT_DIALOG_DATA) private data: any, private apiService: ApiService, private dialogRef: MatDialogRef<any>) { }

  ngOnInit() {
    this.makeForm();
  }

  makeForm () {
    this.changePasswordForm = new FormGroup({
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      confirmation_password: new FormControl(null, [Validators.required, Validators.minLength(8)])
    });
  }

  onToggle (eye, type) {
    this[eye] = this[eye] == 'visibility' ? 'visibility_off' : 'visibility';
    this[type] = this[type] == 'password' ? 'text' : 'password';
  }

  onChangePassword () {
    console.log(this.changePasswordForm.value, this.changePasswordForm.valid)
    this.loader = true;
    this.dialogRef.disableClose = true;
    if (this.changePasswordForm.valid) {
      this.changePasswordForm.disable();
      this.apiService.connection('POST', 'master-user-password', this.changePasswordForm.value, '', this.data.rowData._id).subscribe({
        next: (response: any) => {
          this.dialogRef.close(true);
          this.apiService.callSnack('Success update password user', 'Close');
          this.loader = false;
        },
        error: ({error}: HttpErrorResponse) => {
          this.loader = false;
          this.dialogRef.disableClose = false;
          this.changePasswordForm.enable();
          this.apiService.processErrorHttp(!error.error ? error : error.error);
        }
      });
    } else {
      this.apiService.callSnack(this.apiService.errGeneral, 'Close');
    }
  }
}
