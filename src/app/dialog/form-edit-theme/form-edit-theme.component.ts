import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-form-edit-theme',
  templateUrl: './form-edit-theme.component.html',
  styleUrls: ['./form-edit-theme.component.css']
})
export class FormEditThemeComponent implements OnInit {
  themeForm: FormGroup;
  loader: boolean = false;
  roles: any = [];
  status: any = [];
  adminRole: any = null;
  merchants: any[] = [];
  merchantAdmin: any = [];
  formDone: boolean = false;

  constructor (@Inject(MAT_DIALOG_DATA) private data: any, private sharedService: SharedService, private apiService: ApiService, private dialog: MatDialog, private dialogRef: MatDialogRef<any>) {}

  ngOnInit() {
    this.makeForm();
  }

  makeForm () {
    this.themeForm = new FormGroup({
      theme: new FormControl(this.data.rowData.theme, [Validators.required])
    });
  }

  onCloseDialog () {
    this.dialogRef.close(false);
  }

  onUpdateTheme () {
    if (this.themeForm.valid) {
      this.dialogRef.disableClose = true;
      this.themeForm.disable();

      this.apiService.connection('POST', 'master-theme-name', this.themeForm.value, '', this.data.rowData._id).subscribe({
        next: (response: any) => {
          this.dialogRef.close(true);
          this.apiService.callSnack('Success update theme', 'Close');
          this.loader = false;
        },
        error: ({error}: HttpErrorResponse) => {
          this.loader = false;
          this.themeForm.enable();
          this.apiService.processErrorHttp(error.error);
          this.dialogRef.disableClose = false;
        }
      })
    } else {
      this.apiService.callSnack('Input not valid', 'Close');
    }
  }
}
