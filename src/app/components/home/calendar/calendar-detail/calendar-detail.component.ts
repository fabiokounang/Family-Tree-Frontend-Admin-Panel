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
  emptyDay: any = {};
  constructor (private dialog: MatDialog, private apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getOneCalendar();
  }

  getOneCalendar () {
    this.loader = true;
		this.apiService.connection('POST', 'master-calendar-admin', {}, '', this.route.snapshot.params['id']).subscribe({
			next: (response: any) => {
				this.calendar = response.value;
        this.processEmptyDay();
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
      maxHeight: '90vh',
      data: {
        _id: this.route.snapshot.params['id'],
        calendar: calendar,
        month: month,
        day: day
      }
    }
    const dialog = this.dialog.open(FormEventCalendarComponent, objDialog);

    dialog.afterClosed().subscribe((result) => {
      if (result) this.getOneCalendar();
    });
  }

  processEmptyDay () {
    Object.keys(this.calendar.calendar).forEach((key: any) => {
      const year = new Date().getFullYear();
      const month = key - 1;
      const d = `${this.months[month]} 1, ${year} 00:00:01`;
      const day = new Date(d).getDay();
      this.emptyDay[month] = Array.from(Array(day).keys());
    });
  }

}
