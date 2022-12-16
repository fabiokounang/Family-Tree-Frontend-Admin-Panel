import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DropdownInterface } from 'src/app/interfaces/dropdown.interface';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-form-add-calendar',
  templateUrl: './form-add-calendar.component.html',
  styleUrls: ['./form-add-calendar.component.css']
})
export class FormAddCalendarComponent implements OnInit {
  loader: boolean = false;
  formCalendar: FormGroup;
  provincies: DropdownInterface[] = [];
  fileName: string = '';
  file: any = null;

  constructor (@Inject(MAT_DIALOG_DATA) private data: any, private apiService: ApiService, private sharedService: SharedService, private dialogRef: MatDialogRef<any>) { }

  ngOnInit(): void {
    this.fillData();
    this.makeForm();
  }

  fillData () {
    this.provincies = this.data.provincies;
    console.log(this.provincies)
  }

  makeForm () {
    this.formCalendar = new FormGroup({
      province: new FormControl(null, [Validators.required])
    })
  }

  onChangeFile (file: File, event) {
    this.fileName = file[0].name;
    this.file = file[0];
    event.target.value = '';
  }

  onAddCalendar () {
    this.loader = true;
    if (this.formCalendar.valid) {
      this.formCalendar.disable();
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('province', this.formCalendar.value.province);
      this.apiService.connectionBlob('master-calendar-create', formData).subscribe({
        next: (response: any) => {
          this.sharedService.callSnack('Success create calendar', 'Dismiss');
          this.dialogRef.close(true);
          this.fileName = '';
        },
        error: (error: HttpErrorResponse) => {
          this.loader = false;
          this.formCalendar.enable();
          this.sharedService.callSnack('Something went wrong', 'Dismiss');
        }
      });
    } else {
      this.sharedService.callSnack('Input not valid', 'Close');
    }
	}

}
