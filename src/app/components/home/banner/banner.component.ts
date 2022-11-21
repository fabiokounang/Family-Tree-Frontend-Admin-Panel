import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Meta } from '@angular/platform-browser';

import { Subscription } from 'rxjs';
import { FormAddBannerComponent } from 'src/app/dialog/form-add-banner/form-add-banner.component';
import { FormConfirmationComponent } from 'src/app/dialog/form-confirmation/form-confirmation.component';
import { FormEditBannerComponent } from 'src/app/dialog/form-edit-banner/form-edit-banner.component';
import { BannerInterface } from 'src/app/interfaces/banner.interface';
import { BannerPaginationInterface } from 'src/app/interfaces/bannerpagination.interface';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {
  displayedColumns: String[] = ['image', 'status', 'created_at', 'action'];
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

  constructor (private apiService: ApiService, private dialog: MatDialog, private meta: Meta) {}

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
    this.apiService.connection('POST', 'master-banner', this.tableQueryData).subscribe({
      next: (response: BannerPaginationInterface) => {
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

  onOpenConfirmation (admin: BannerInterface, type: String) {
    const dialog = this.dialog.open(FormConfirmationComponent, {
      data: {
        text: 'Are you sure you want to ' + type + ' this banner ?'
      }
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) this.deleteAdmin(admin);
    })
  }

  deleteAdmin (admin: BannerInterface) {
    this.apiService.connection('POST', 'master-banner-delete', {}, '', admin._id).subscribe({
      next: (response: any) => {
        this.apiService.callSnack('Success delete banner', 'Close');
        this.loader = false;
        this.getAllData();
      },
      error: ({error}: HttpErrorResponse) => {
        this.loader = false;
        this.apiService.processErrorHttp(!error.error ? error : error.error);
      }
    });
  }

  updateStatusAdmin (admin: BannerInterface, event) {
    this.apiService.connection('POST', 'master-banner-status', { status: event.checked ? 1 : 2 }, '', admin._id).subscribe({
      next: (response: any) => {
        this.apiService.callSnack('Success update status banner', 'Close');
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
    const dialog = this.dialog.open(FormAddBannerComponent, {
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
    const dialog = this.dialog.open(FormEditBannerComponent, {
      width: '500px',
      data: {
        banner: data,
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
