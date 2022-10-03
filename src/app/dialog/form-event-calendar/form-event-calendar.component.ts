import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-form-event-calendar',
  templateUrl: './form-event-calendar.component.html',
  styleUrls: ['./form-event-calendar.component.css']
})
export class FormEventCalendarComponent implements OnInit {
  eventForm: FormGroup;
  calendar: any = null;
  month: number = null;
  day: number = null;
  loader: boolean = false;

  constructor (@Inject(MAT_DIALOG_DATA) private data: any, private apiService: ApiService, private dialog: MatDialog, private dialogRef: MatDialogRef<any>, private route: ActivatedRoute) {}


  ngOnInit(): void {
    this.calendar = this.data.calendar;
    this.month = this.data.month;
    this.day = this.data.day;

    this.makeForm();
  }

  makeForm () {
    this.eventForm = new FormGroup({
      month: new FormControl(this.month),
      day: new FormControl(this.day),
      events: new FormArray(this.populateEvent())
    })
  }

  populateEvent () {
    const { calendar } = this.calendar;
    if (calendar[this.month][this.day].length <= 0) {
      return [new FormGroup({
        name: new FormControl(null, [Validators.required]),
        description: new FormControl(null)
      })];
    }
    const result = calendar[this.month][this.day].map((value) => {
      return new FormGroup({
        name: new FormControl(value.name, [Validators.required]),
        description: new FormControl(value.description)
      });
    });
    return result;
  }

  onAddNewEvent () {
    const control: FormArray = ( < FormArray > this.eventForm.get('events'));
    control.push(new FormGroup({
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null)
    }));

    this.dialogRef.updateSize('500px', '660px');
  }

  removeFormArray(i) {
    const control: FormArray = ( < FormArray > this.eventForm.get('events'));
    control.removeAt(i - 1);
  }

  onSubmitEvent () {
    this.loader = true;
    const objData = {
      "month": this.month,
      "day": this.day,
      "events": this.eventForm.value.events
    }

    this.apiService.connection('POST', 'master-calendar-update', objData, '', this.data._id).subscribe({
      next: (response: any) => {
        this.dialogRef.close(true);
        this.apiService.callSnack('Success update event', 'Dismiss');
      },
      error: (error: HttpErrorResponse) => {
        this.loader = false;
        this.apiService.processErrorHttp(!error.error ? error : error.error);
      },
      complete: () => {
        this.loader = false;
      }
    })
  }

}
