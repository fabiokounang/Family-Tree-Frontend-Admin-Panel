import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { FormEventCalendarComponent } from 'src/app/dialog/form-event-calendar/form-event-calendar.component';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-calendar-detail',
  templateUrl: './calendar-detail.component.html',
  styleUrls: ['./calendar-detail.component.css']
})
export class CalendarDetailComponent implements OnInit {
  objectKeys = Object.keys;
  calendar: any;
  loader: boolean = false;
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  constructor (private dialog: MatDialog, private apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getOneCalendar();
  }

  getOneCalendar () {
    this.loader = true;
		this.apiService.connection('POST', 'master-calendar', {}, '', this.route.snapshot.params['id']).subscribe({
			next: (response: any) => {
				this.calendar = response.value;
			},
			error: ({error}: HttpErrorResponse) => {
				this.loader = false;
			  this.apiService.processErrorHttp(!error.error ? error : error.error);
      },
      complete: () => {
        this.loader = false;
      }
		})
  }

  onOpenFormEvent (calendar, month, day) {
    const objDialog: any = {
      width: '500px',
      data: {
        _id: this.route.snapshot.params['id'],
        calendar: calendar,
        month: month,
        day: day
      }
    }

    if (calendar.calendar[month][day].length > 3) objDialog.height = '660px';
    const dialog = this.dialog.open(FormEventCalendarComponent, objDialog);

    dialog.afterClosed().subscribe((result) => {
      if (result) this.getOneCalendar();
    });
  }

}
