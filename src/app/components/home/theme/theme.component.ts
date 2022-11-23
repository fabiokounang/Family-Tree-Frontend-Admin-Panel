import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';

import { FormAddThemeComponent } from 'src/app/dialog/form-add-theme/form-add-theme.component';
import { FormConfirmationComponent } from 'src/app/dialog/form-confirmation/form-confirmation.component';
import { FormEditThemeComponent } from 'src/app/dialog/form-edit-theme/form-edit-theme.component';
import { AdminPaginationInterface } from 'src/app/interfaces/adminpagination.interface';
import { ThemeInterface } from 'src/app/interfaces/theme.interface';

import { ApiService } from '../../../services/api.service';
@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.css']
})
export class ThemeComponent implements OnInit {
  displayedColumns: String[] = ['theme', 'color', 'text', 'status', 'created_at', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  totalAll: any = 0;
  loader: boolean = false;
  objectKeys = Object.keys;
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
  subscription: Subscription;
  isFilter: any = false;
  userRole: any = null;
  userId: any = null;

  constructor (private apiService: ApiService, private dialog: MatDialog) {}

  ngOnInit() {
    this.fillData();
    this.getAllData();
  }

  ngOnDestroy () {
    if (this.subscription && !this.subscription.closed) this.subscription.unsubscribe();
  }

  fillData () {
    this.userRole = this.apiService.getLocalStorageRole();
    this.userId = this.apiService.getLocalStorageId();
  }

  getAllData () {
    this.loader = true;
    this.apiService.connection('POST', 'master-theme', this.tableQueryData).subscribe({
      next: (response: AdminPaginationInterface) => {
        this.tableQueryData.page = response.page;
        this.tableQueryData.limit = response.limit;
        this.tableQueryData.max = response.max;
        this.totalAll = response.total;
        this.dataSource = new MatTableDataSource(response.values);
      },
      error: ({ error }: HttpErrorResponse) => {
        this.loader = false;
        this.apiService.processErrorHttp(!error.error ? error : error.error);
      },
      complete: () => {
        this.loader = false;
      }
    });
  }

  onChangecolor (theme: ThemeInterface, event) {
    const color = event.target.value;
    this.apiService.connection('POST', 'master-theme-color', { color: color }, '', theme._id).subscribe({
      next: (response: any) => {
        this.apiService.callSnack('Success update color theme', 'Close');
        this.loader = false;
        this.getAllData();
      },
      error: ({error}: HttpErrorResponse) => {
        this.loader = false;
        this.apiService.processErrorHttp(!error.error ? error : error.error);
      }
    });
  }

  onChangetext (theme: ThemeInterface, event) {
    const text = event.target.value;
    this.apiService.connection('POST', 'master-theme-text', { text: text }, '', theme._id).subscribe({
      next: (response: any) => {
        this.apiService.callSnack('Success update text theme', 'Close');
        this.loader = false;
        this.getAllData();
      },
      error: ({error}: HttpErrorResponse) => {
        this.loader = false;
        this.apiService.processErrorHttp(!error.error ? error : error.error);
      }
    });
  }

  onOpenConfirmation (theme: ThemeInterface, type: String) {
    const dialog = this.dialog.open(FormConfirmationComponent, {
      data: {
        text: 'Are you sure you want to ' + type + ' this theme ?'
      }
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) this.deleteTheme(theme);
    })
  }

  deleteTheme (theme: ThemeInterface) {
    this.apiService.connection('POST', 'master-theme-delete', {}, '', theme._id).subscribe({
      next: (response: any) => {
        this.apiService.callSnack('Success delete theme', 'Close');
        this.loader = false;
        this.getAllData();
      },
      error: ({error}: HttpErrorResponse) => {
        this.loader = false;
        this.apiService.processErrorHttp(!error.error ? error : error.error);
      }
    });
  }

  updateStatusTheme (theme: ThemeInterface, event) {
    this.apiService.connection('POST', 'master-theme-status', { status: event.checked ? 1 : 2 }, '', theme._id).subscribe({
      next: (response: any) => {
        this.apiService.callSnack('Success update status theme', 'Close');
        this.loader = false;
        this.getAllData();
      },
      error: ({error}: HttpErrorResponse) => {
        this.loader = false;
        this.apiService.processErrorHttp(!error.error ? error : error.error);
      }
    });
  }

  onOpenAddForm () {
    const dialog = this.dialog.open(FormAddThemeComponent, {
      width: '500px',
      data: {}
    });

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.resetData();
        this.getAllData();
      }
    });
  }

  onOpenEditForm (element) {
    const dialog = this.dialog.open(FormEditThemeComponent, {
      width: '500px',
      data: {
        rowData: element
      }
    });

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.resetData();
        this.getAllData();
      }
    });
  }

  onResetFilter () {
    this.tableQueryData.filter = [];
    this.getAllData();
    // this.apiService.removeFilterData();
    this.isFilter = false;
  }

  sortData(event) {
    let sort = (event.direction == 'asc' || event.direction == '') ? 1 : -1;
    let column = event.active;
    if (sort && column) {
      this.tableQueryData.sort_attr = column;
      this.tableQueryData.sort = sort;
    }
    this.getAllData();
  }

  onPageChange (event) {
    this.tableQueryData.page = event.pageIndex;
    this.tableQueryData.limit = event.pageSize ? event.pageSize : this.tableQueryData.limit;
    this.getAllData();
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
