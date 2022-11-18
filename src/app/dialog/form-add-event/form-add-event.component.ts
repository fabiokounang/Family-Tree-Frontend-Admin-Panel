import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DropdownInterface } from 'src/app/interfaces/dropdown.interface';
import { ProvinceInterface } from 'src/app/interfaces/province.interface';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-form-add-event',
  templateUrl: './form-add-event.component.html',
  styleUrls: ['./form-add-event.component.css']
})
export class FormAddEventComponent implements OnInit {
  eventForm: FormGroup;
  types: DropdownInterface[] = [];
  scopes: DropdownInterface[] = [];
  loader: boolean = false;
  province: ProvinceInterface[] = [];

  constructor (@Inject(MAT_DIALOG_DATA) private data: any, private sharedService: SharedService, private apiService: ApiService, private dialog: MatDialog, private dialogRef: MatDialogRef<any>) {}

  ngOnInit() {
    this.fillData();
    this.makeForm();
  }

  fillData () {
    this.types = this.sharedService.getOccasionType();
    this.scopes = this.sharedService.getScopes();
    this.province = this.data.province;
  }

  makeForm () {
    this.eventForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      // type: new FormControl(null, [Validators.required]),
      scope: new FormControl(null, [Validators.required]),
      point: new FormControl(null, [Validators.required]),
      expired_date: new FormControl(null, [Validators.required]),
    });
    console.log(this.eventForm.get('scope').value)
  }


  onChangeScope (event) {
    console.log(event);
    if (event.value <= 2) this.eventForm.addControl('province', new FormControl(null, [Validators.required]));
    else this.eventForm.removeControl('province');
  }

  onCloseDialog () {
    this.dialogRef.close(false);
  }

  onAddEvent () {
    if (this.eventForm.valid) {
      this.loader = true;
      this.dialogRef.disableClose = true;
      this.eventForm.disable();
      this.eventForm.value.expired_date = new Date(this.eventForm.value.expired_date).getTime();
      this.apiService.connection('POST', 'master-occasion-create', this.eventForm.value).subscribe({
        next: (response: any) => {
          this.dialogRef.close(true);
          this.apiService.callSnack('Success create event', 'Close');
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
