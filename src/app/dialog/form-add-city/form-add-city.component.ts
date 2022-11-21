import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-form-add-city',
  templateUrl: './form-add-city.component.html',
  styleUrls: ['./form-add-city.component.css']
})
export class FormAddCityComponent implements OnInit {
  cityForm: FormGroup;
  loader: boolean = false;

  constructor (@Inject(MAT_DIALOG_DATA) private data: any, private apiService: ApiService, private dialogRef: MatDialogRef<any>) { }

  ngOnInit(): void {
    this.makeForm();
  }

  makeForm () {
    this.cityForm = new FormGroup({
      city: new FormControl(null, [Validators.required])
    })
  }

  onCloseDialog () {
    this.dialogRef.close(false);
  }

  onAddCity () {
    if (this.cityForm.valid) {
      this.loader = true;
      this.dialogRef.disableClose = true;
      this.cityForm.disable();
      const objCity = {
        province: this.data,
        city: this.cityForm.value.city
      }

      this.apiService.connection('POST', 'master-city-create', objCity).subscribe({
        next: (response: any) => {
          this.dialogRef.close(true);
          this.apiService.callSnack('Success create city', 'Close');
          this.loader = false;
        },
        error: ({error}: HttpErrorResponse) => {
          this.loader = false;
          this.dialogRef.close(true);
          this.apiService.processErrorHttp(!error.error ? error : error.error);
        }
      })
    } else {
      this.apiService.callSnack('Input not valid', 'Close');
    }
  }

}
