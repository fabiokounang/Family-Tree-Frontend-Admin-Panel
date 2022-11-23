import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-form-add-theme',
  templateUrl: './form-add-theme.component.html',
  styleUrls: ['./form-add-theme.component.css']
})
export class FormAddThemeComponent implements OnInit {
  themeForm: FormGroup;
  loader: boolean = false;
  roles: any = [];
  status: any = [];
  eyePassword = 'visibility';
  typePassword = 'password';
  eyeConfirmPassword = 'visibility';
  typeConfirmPassword = 'password';
  adminRole: any = null;
  merchants: any[] = [];

  constructor (private sharedService: SharedService, private apiService: ApiService, private dialog: MatDialog, private dialogRef: MatDialogRef<any>) {}

  ngOnInit() {
    this.makeForm();
  }

  makeForm () {
    this.themeForm = new FormGroup({
      theme: new FormControl(null, [Validators.required]),
      color: new FormControl(null, [Validators.required]),
      text: new FormControl(null, [Validators.required])
    });
  }

  onCloseDialog () {
    this.dialogRef.close(false);
  }

  onAddTheme () {
    if (this.themeForm.valid) {
      this.loader = true;
      this.dialogRef.disableClose = true;
      this.themeForm.disable();
      this.apiService.connection('POST', 'master-theme-create', this.themeForm.value).subscribe({
        next: (response: any) => {
          this.dialogRef.close(true);
          this.apiService.callSnack('Success create theme', 'Close');
          this.loader = false;
        },
        error: ({error}: HttpErrorResponse) => {
          this.loader = false;
          this.dialogRef.disableClose = false;
          this.themeForm.enable();
          this.apiService.processErrorHttp(!error.error ? error : error.error);
        }
      })
    } else {
      this.apiService.callSnack('Input not valid', 'Close');
    }
  }
}
