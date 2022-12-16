import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DropdownInterface } from 'src/app/interfaces/dropdown.interface';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-form-edit-calendar',
  templateUrl: './form-edit-calendar.component.html',
  styleUrls: ['./form-edit-calendar.component.css']
})
export class FormEditCalendarComponent implements OnInit {
  calendarForm: FormGroup;
  loader: boolean = false;

  constructor (@Inject(MAT_DIALOG_DATA) private data: any, private sharedService: SharedService, private apiService: ApiService, private dialog: MatDialog, private dialogRef: MatDialogRef<any>) {}

  ngOnInit() {
    this.makeForm();
  }

  makeForm () {
    this.calendarForm = new FormGroup({
      name: new FormControl(this.data.name, [Validators.required]),
      year: new FormControl(this.data.year, [Validators.required]),
      province: new FormControl(this.data.province, [Validators.required]),
    });
  }

  onCloseDialog () {
    this.dialogRef.close(false);
  }

  onUpdateCalendar () {
    if (this.calendarForm.valid) {
      this.loader = true;
      this.dialogRef.disableClose = true;
      this.calendarForm.disable();
      this.apiService.connection('POST', 'master-calendar-update-data', this.calendarForm.value, '', this.data._id).subscribe({
        next: (response: any) => {
          this.dialogRef.close(true);
          this.apiService.callSnack('Sukses update kalender', 'Close');
          this.loader = false;
        },
        error: ({error}: HttpErrorResponse) => {
          this.loader = false;
          this.calendarForm.enable();
          this.dialogRef.disableClose = false;
          this.apiService.processErrorHttp(!error.error ? error : error.error);
        }
      })
    } else {
      this.apiService.callSnack('Input not valid', 'Close');
    }
  }
}
