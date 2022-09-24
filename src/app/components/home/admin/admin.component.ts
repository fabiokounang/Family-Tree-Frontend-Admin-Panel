import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { elementAt, Subscription } from 'rxjs';
import { FormAddAdminComponent } from 'src/app/dialog/form-add-admin/form-add-admin.component';
import { FormChangePasswordAdminComponent } from 'src/app/dialog/form-change-password-admin/form-change-password-admin.component';
import { FormConfirmationComponent } from 'src/app/dialog/form-confirmation/form-confirmation.component';
import { FormEditAdminComponent } from 'src/app/dialog/form-edit-admin/form-edit-admin.component';
import { AdminInterface } from 'src/app/interfaces/admin.interface';
import { AdminPaginationInterface } from 'src/app/interfaces/adminpagination.interface';

import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {
  displayedColumns: String[] = ['username', 'role', 'status', 'created_at', 'action'];
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
    this.apiService.connection('POST', 'master-admin', this.tableQueryData).subscribe({
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

  onOpenConfirmation (admin: AdminInterface, type: String) {
    const dialog = this.dialog.open(FormConfirmationComponent, {
      data: {
        text: 'Are you sure you want to ' + type + ' this admin ?'
      }
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) this.deleteAdmin(admin);
    })
  }

  deleteAdmin (admin: AdminInterface) {
    this.apiService.connection('POST', 'master-admin-delete', {}, '', admin._id).subscribe({
      next: (response: any) => {
        this.apiService.callSnack('Success delete admin', 'Close');
        this.loader = false;
        this.getAllData();
      },
      error: ({error}: HttpErrorResponse) => {
        this.loader = false;
        this.apiService.processErrorHttp(!error.error ? error : error.error);
      }
    });
  }

  updateStatusAdmin (admin: AdminInterface, event) {
    this.apiService.connection('POST', 'master-admin-status', { status: event.checked ? 1 : 2 }, '', admin._id).subscribe({
      next: (response: any) => {
        this.apiService.callSnack('Success update status admin', 'Close');
        this.loader = false;
        this.getAllData();
      },
      error: ({error}: HttpErrorResponse) => {
        this.loader = false;
        this.apiService.processErrorHttp(!error.error ? error : error.error);
      }
    });
  }

  onOpenChangePassword (admin: AdminInterface, index) {
    const dialog = this.dialog.open(FormChangePasswordAdminComponent, {
      width: '500px',
      data: {
        rowData: admin,
        index: index
      }
    });
    dialog.afterClosed().subscribe((result) => {});
  }

  onOpenAddForm () {
    const dialog = this.dialog.open(FormAddAdminComponent, {
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

  onOpenEditForm (data, index) {
    const dialog = this.dialog.open(FormEditAdminComponent, {
      width: '500px',
      data: {
        rowData: data,
        index: index
      }
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) this.getAllData();
    });
  }

  onResetFilter () {
    this.tableQueryData.filter = [];
    this.getAllData();
    // this.apiService.removeFilterData();
    this.isFilter = false;
  }

  sortData(event) {
    let sort = (event.direction == 'asc' || event.direction == '') ? 1 : 2;
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
