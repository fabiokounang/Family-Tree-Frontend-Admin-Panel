import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-form-edit-city',
  templateUrl: './form-edit-city.component.html',
  styleUrls: ['./form-edit-city.component.css']
})
export class FormEditCityComponent implements OnInit {

  cityForm: FormGroup;
  loader: boolean = false;

  constructor (@Inject(MAT_DIALOG_DATA) private data: any, private apiService: ApiService, private dialogRef: MatDialogRef<any>) { }

  ngOnInit(): void {
    this.makeForm();
  }

  makeForm () {
    this.cityForm = new FormGroup({
      city: new FormControl(this.data.rowData.city, [Validators.required])
    })
  }

  onCloseDialog () {
    this.dialogRef.close(false);
  }

  onUpdateCity () {
    if (this.cityForm.valid) {
      this.loader = true;
      this.dialogRef.disableClose = true;
      this.cityForm.disable();
      this.apiService.connection('POST', 'master-city-update', this.cityForm.value, '', this.data.rowData._id).subscribe({
        next: (response: any) => {
          this.dialogRef.close(true);
          this.apiService.callSnack('Success update city', 'Close');
          this.loader = false;
        },
        error: ({error}: HttpErrorResponse) => {
          this.loader = false;
          this.cityForm.enable();
          this.dialogRef.disableClose = false;
          this.apiService.processErrorHttp(!error.error ? error : error.error);
        }
      })
    } else {
      this.apiService.callSnack('Input not valid', 'Close');
    }
  }
}
