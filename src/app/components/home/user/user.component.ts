import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';
import { DetailUserComponent } from 'src/app/dialog/detail-user/detail-user.component';
import { UserInterface } from 'src/app/interfaces/user.interface';
import { UserPaginationInterface } from 'src/app/interfaces/userpagination.interface';

// import { FormAddAdminComponent } from 'src/app/dialog/form-add-admin/form-add-admin.component';
// import { FormChangePasswordAdminComponent } from 'src/app/dialog/form-change-password-admin/form-change-password-admin.component';
// import { FormEditAdminComponent } from 'src/app/dialog/form-edit-admin/form-edit-admin.component';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  displayedColumns: any[] = ['username', 'status', 'created_at', 'action'];
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
  merchants: any[] = [];
  isFilter: any = false;
  userRole: any = null;

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

  onConfirmation (data, index, type) {
    // const dialog = this.dialog.open(FormConfirmationComponent, {
    //   data: {
    //     text: 'Apakah anda yakin ingin ' + type + ' admin ini ?'
    //   }
    // });
    // dialog.afterClosed().subscribe((result) => {
    //   if (result == true) {
    //     if (type == 'nonaktifkan') this.deactivateAdmin(data, index);
    //     if (type == 'aktifkan') this.activateAdmin(data, index);
    //   }
    // })
  }

  onOpenChangePassword (data, index) {
    // const dialog = this.dialog.open(FormChangePasswordAdminComponent, {
    //   width: '500px',
    //   data: {
    //     type: 'admin',
    //     rowData: data,
    //     index: index
    //   }
    // });
    // dialog.afterClosed().subscribe((result) => {});
  }

  onOpenAddForm () {
    // const dialog = this.dialog.open(FormAddAdminComponent, {
    //   width: '500px',
    //   data: {
    //     merchants: this.merchants
    //   }
    // });

    // dialog.afterClosed().subscribe((result) => {
    //   if (result) {
    //     this.resetData();
    //     this.getAllData();
    //   }
    // });
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
    let sort = (event.direction == 'asc' || event.direction == '') ? 1 : 2;
    let column = event.active;
    if (sort && column) {
      this.tableQueryData.sort_attr = column;
      this.tableQueryData.sort = sort;
    }
    this.getAllData();
  }

  onPageChange (event) {
    this.tableQueryData.page = event.pageIndex + 1;
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
