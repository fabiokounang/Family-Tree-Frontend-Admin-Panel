import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DropdownInterface } from 'src/app/interfaces/dropdown.interface';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-form-edit-event',
  templateUrl: './form-edit-event.component.html',
  styleUrls: ['./form-edit-event.component.css']
})
export class FormEditEventComponent implements OnInit {
  eventForm: FormGroup;
  types: DropdownInterface[] = [];
  loader: boolean = false;

  constructor (@Inject(MAT_DIALOG_DATA) private data: any, private sharedService: SharedService, private apiService: ApiService, private dialog: MatDialog, private dialogRef: MatDialogRef<any>) {}

  ngOnInit() {
    this.fillData();
    this.makeForm();
  }

  fillData () {
    this.types = this.sharedService.getOccasionType();
  }

  makeForm () {
    this.eventForm = new FormGroup({
      title: new FormControl(this.data.rowData.title, [Validators.required]),
      type: new FormControl(this.data.rowData.type, [Validators.required]),
      expired_date: new FormControl(new Date(this.data.rowData.expired_date), [Validators.required]),
      point: new FormControl(this.data.rowData.point, [Validators.required])
  });
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
      this.apiService.connection('POST', 'master-occasion-update', this.eventForm.value, '', this.data.rowData._id).subscribe({
        next: (response: any) => {
          this.dialogRef.close(true);
          this.apiService.callSnack('Success update event', 'Close');
          this.loader = false;
        },
        error: ({error}: HttpErrorResponse) => {
          this.loader = false;
          this.dialogRef.disableClose = false;
          this.eventForm.enable();
          this.apiService.processErrorHttp(!error.error ? error : error.error);
        }
      })
    } else {
      this.apiService.callSnack('Input not valid', 'Close');
    }
  }

}
