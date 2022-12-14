import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  OnInit
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FormAddCalendarComponent } from 'src/app/dialog/form-add-calendar/form-add-calendar.component';
import { FormConfirmationComponent } from 'src/app/dialog/form-confirmation/form-confirmation.component';
import { FormEditCalendarComponent } from 'src/app/dialog/form-edit-calendar/form-edit-calendar.component';
import { DropdownInterface } from 'src/app/interfaces/dropdown.interface';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
	loader: boolean = false;
  calendar: any = [];
  objectKeys = Object.keys;
  file: any = null;
  fileName: any = null;
	displayedColumns: String[] = ['name', 'year', 'province', 'status', 'created_at', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  totalAll: any = 0;
  searchText: string = '';
	tableQueryData: any = {
    page: 0,
    limit: 10,
    max: 0,
    total: 0,
    search: '',
    sort_attr: 'created_at',
    sort: -1,
    filter: {}
  }
  name: string = '';
  provincies: DropdownInterface[] = [];

  constructor (private apiService: ApiService, private router: Router, private route: ActivatedRoute, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getAllData();
  }

  getAllData() {
		this.loader = true;
		this.apiService.connection('POST', 'master-calendar').subscribe({
			next: (response: any) => {
				this.dataSource = new MatTableDataSource(response.values);
        this.provincies = response.provincies;
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

	addCalendar () {
    if (this.name) {
      this.loader = true;
      this.apiService.connection('POST', 'master-calendar-create', { name: this.name }).subscribe({
        next: (response: any) => {
          this.getAllData();
          this.apiService.callSnack('Success create new calendar', 'Dismiss');
        },
        error: ({error}: HttpErrorResponse) => {
          this.loader = false;
          this.apiService.processErrorHttp(!error.error ? error : error.error);
        },
        complete: () => {
          this.name = '';
          this.loader = false;
        }
      })
    }
	}

  updateStatusCalendar (element, event) {
    this.loader = true;
    const objData = { status: event.checked, province: element.province._id }
		this.apiService.connection('POST', 'master-calendar-update-status', objData, '', element._id).subscribe({
			next: (response: any) => {
        this.getAllData();
        this.apiService.callSnack('Success update status calendar', 'Dismiss');
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

  onConfirmation (data, type) {
    const dialog = this.dialog.open(FormConfirmationComponent, {
      data: {
        text: 'Are you sure you want to '+ type + ' this calendar ?'
      }
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) this.deleteCalendar(data);
    })
  }

  deleteCalendar (calendar) {
    this.loader = true;
		this.apiService.connection('POST', 'master-calendar-delete', {}, '', calendar._id).subscribe({
			next: (response: any) => {
        this.getAllData();
        this.apiService.callSnack('Success delete calendar', 'Dismiss');
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

  onDelete () {
    this.file = null;
    this.fileName = null;
  }

	onOpenDetailCalendar (element) {
		this.router.navigate([element._id], { relativeTo: this.route })
	}

  onOpenAddCalendar () {
    const dialog = this.dialog.open(FormAddCalendarComponent, {
      width: '400px',
      data: {
        provincies: this.provincies
      }
    });

    dialog.afterClosed().subscribe((result) => {
      if (result) this.getAllData();
    })
  }

  onOpenEditCalendar (element) {
		const dialog = this.dialog.open(FormEditCalendarComponent, {
      width: '400px',
      data: {
        calendar: element,
        provincies: this.provincies
      }
    });

    dialog.afterClosed().subscribe((result) => {
      if (result) this.getAllData();
    });
	}

  onSearch () {
    this.tableQueryData.search = this.searchText;
    this.getAllData();
  }

  onDetectEmpty () {
    if (!this.searchText) {
      this.resetData();
      this.getAllData();
    }
  }

	resetData () {
    this.tableQueryData.page = 0;
    this.tableQueryData.limit = 10;
    this.tableQueryData.total = 0;
    this.tableQueryData.search = '';
    this.tableQueryData.sort_attr = 'created_at';
    this.tableQueryData.sort = -1;
    this.tableQueryData.filter = [];
  }

  identify (item, i) {
    return item.id;
  }
}
