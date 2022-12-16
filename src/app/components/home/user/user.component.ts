import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';
import { DetailUserComponent } from 'src/app/dialog/detail-user/detail-user.component';
import { FormAddUserComponent } from 'src/app/dialog/form-add-user/form-add-user.component';
import { FormChangePasswordUserComponent } from 'src/app/dialog/form-change-password-user/form-change-password-user.component';
import { FormConfirmationComponent } from 'src/app/dialog/form-confirmation/form-confirmation.component';
import { UserInterface } from 'src/app/interfaces/user.interface';
import { UserPaginationInterface } from 'src/app/interfaces/userpagination.interface';

import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  displayedColumns: String[] = ['fullname', 'status', 'created_at', 'action'];
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
  fileName: any = null;
  file: any = null;

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
  }

  getAllData () {
    this.loader = true;
    this.apiService.connection('POST', 'master-user', this.tableQueryData).subscribe({
      next: (response: UserPaginationInterface) => {
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

  onChangeFile (file: File, event) {
    this.fileName = file[0].name;
    this.file = file[0];
    const formData = new FormData();
    formData.append('file', this.file);
    this.apiService.connectionBlob('master-user-bulk-create', formData).subscribe({
      next: (response: any) => {
        this.apiService.callSnack('Success upload user', 'Dismiss');
        this.getAllData();
        this.fileName = '';
      },
      error: (error: HttpErrorResponse) => {
        this.loader = false;
        this.apiService.callSnack('Something went wrong', 'Dismiss');
      }
    });
    event.target.value = '';
  }

  onConfirmation (data, index) {
    const dialog = this.dialog.open(FormConfirmationComponent, {
      data: {
        text: 'Are you sure you want to delete user <strong>' + data.fullname + '</strong> ?'
      }
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) this.deleteUser(data);
    });
  }

  deleteUser (user) {
    this.apiService.connection('POST', 'master-user-delete', {}, '', user._id).subscribe({
      next: (response: any) => {
        this.apiService.callSnack('Success delete user', 'Close');
        this.loader = false;
        this.getAllData();
      },
      error: ({error}: HttpErrorResponse) => {
        this.loader = false;
        this.apiService.processErrorHttp(!error.error ? error : error.error);
      }
    });
  }

  onOpenChangePassword (data, index) {
    const dialog = this.dialog.open(FormChangePasswordUserComponent, {
      width: '500px',
      data: {
        type: 'user',
        rowData: data,
        index: index
      }
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) this.getAllData();
    });
  }

  onOpenAddForm () {
    const dialog = this.dialog.open(FormAddUserComponent);

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.resetData();
        this.getAllData();
      }
    });
  }

  onOpenEditForm (data, index) {
    // const dialog = this.dialog.open(FormEditAdminComponent, {
    //   width: '500px',
    //   data: {
    //     rowData: data,
    //     index: index,
    //     merchants: this.merchants.map((merchant) => {
    //       return {
    //         id: merchant.id,
    //         name: merchant.user + ' - ' + '(' + merchant.detail.nama + ')'
    //       }
    //     })
    //   }
    // });
    // dialog.afterClosed().subscribe((result) => {
    //   if (result) {
    //     this.getAllData();
    //   }
    // });
  }

  onDetailUser (user: UserInterface) {
    this.dialog.open(DetailUserComponent, {
      width: '500px',
      // height: '580px',
      data: user
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
