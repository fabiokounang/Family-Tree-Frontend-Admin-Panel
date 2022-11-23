import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-form-add-province',
  templateUrl: './form-add-province.component.html',
  styleUrls: ['./form-add-province.component.css']
})
export class FormAddProvinceComponent implements OnInit {
  provinceForm: FormGroup;
  loader: boolean = false;

  constructor (private apiService: ApiService, private dialogRef: MatDialogRef<any>) { }

  ngOnInit(): void {
    this.makeForm();
  }

  makeForm () {
    this.provinceForm = new FormGroup({
      province: new FormControl(null, [Validators.required])
    })
  }

  onCloseDialog () {
    this.dialogRef.close(false);
  }

  onAddProvince () {
    if (this.provinceForm.valid) {
      this.loader = true;
      this.dialogRef.disableClose = true;
      this.provinceForm.disable();
      this.apiService.connection('POST', 'master-province-create', this.provinceForm.value).subscribe({
        next: (response: any) => {
          this.dialogRef.close(true);
          this.apiService.callSnack('Success create province', 'Close');
          this.loader = false;
        },
        error: ({error}: HttpErrorResponse) => {
          this.loader = false;
          this.dialogRef.disableClose = false;
          this.provinceForm.enable();
          this.apiService.processErrorHttp(!error.error ? error : error.error);
        }
      })
    } else {
      this.apiService.callSnack('Input not valid', 'Close');
    }
  }

}
