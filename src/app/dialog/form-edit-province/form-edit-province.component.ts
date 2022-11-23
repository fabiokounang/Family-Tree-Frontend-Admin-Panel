import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-form-edit-province',
  templateUrl: './form-edit-province.component.html',
  styleUrls: ['./form-edit-province.component.css']
})
export class FormEditProvinceComponent implements OnInit {

  provinceForm: FormGroup;
  loader: boolean = false;

  constructor (@Inject(MAT_DIALOG_DATA) private data: any, private apiService: ApiService, private dialog: MatDialog, private dialogRef: MatDialogRef<any>) { }

  ngOnInit(): void {
    this.makeForm();
  }

  makeForm () {
    this.provinceForm = new FormGroup({
      province: new FormControl(this.data.rowData.province, [Validators.required])
    })
  }

  onCloseDialog () {
    this.dialogRef.close(false);
  }

  onUpdateProvince () {
    if (this.provinceForm.valid) {
      this.loader = true;
      this.dialogRef.disableClose = true;
      this.provinceForm.disable();
      this.apiService.connection('POST', 'master-province-update', this.provinceForm.value, '', this.data.rowData._id).subscribe({
        next: (response: any) => {
          this.dialogRef.close(true);
          this.apiService.callSnack('Success update province', 'Close');
          this.loader = false;
        },
        error: ({error}: HttpErrorResponse) => {
          this.loader = false;
          this.dialogRef.close(true);
          this.provinceForm.enable();
          this.apiService.processErrorHttp(!error.error ? error : error.error);
        }
      })
    } else {
      this.apiService.callSnack('Input not valid', 'Close');
    }
  }


}
