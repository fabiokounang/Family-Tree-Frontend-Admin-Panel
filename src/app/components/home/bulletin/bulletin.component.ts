import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Meta } from '@angular/platform-browser';

import { Subscription } from 'rxjs';
import { FormAddBulletinComponent } from 'src/app/dialog/form-add-bulletin/form-add-bulletin.component';
import { FormConfirmationComponent } from 'src/app/dialog/form-confirmation/form-confirmation.component';
import { FormEditBulletinComponent } from 'src/app/dialog/form-edit-bulletin/form-edit-bulletin.component';
import { BulletinInterface } from 'src/app/interfaces/bulletin.interface';
import { BulletinPaginationInterface } from 'src/app/interfaces/bulletinpagination.interface';
import { DropdownInterface } from 'src/app/interfaces/dropdown.interface';
import { ProvinceInterface } from 'src/app/interfaces/province.interface';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-bulletin',
  templateUrl: './bulletin.component.html',
  styleUrls: ['./bulletin.component.css']
})
export class BulletinComponent implements OnInit {
  displayedColumns: String[] = ['province', 'title', 'image', 'status', 'created_at', 'action'];
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
  provincies: DropdownInterface[] = [];

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
    this.apiService.connection('POST', 'master-bulletin', this.tableQueryData).subscribe({
      next: (response: BulletinPaginationInterface) => {
        this.tableQueryData.page = response.page;
        this.tableQueryData.limit = response.limit;
        this.tableQueryData.max = response.max;
        this.totalAll = response.total;
        this.dataSource = new MatTableDataSource(response.values);
        this.provincies = response.provincies;
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

  onOpenConfirmation (admin: BulletinInterface, type: String) {
    const dialog = this.dialog.open(FormConfirmationComponent, {
      data: {
        text: 'Are you sure you want to ' + type + ' this bulletin ?'
      }
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) this.deleteBulletin(admin);
    })
  }

  deleteBulletin (admin: BulletinInterface) {
    this.loader = true;
    this.apiService.connection('POST', 'master-bulletin-delete', {}, '', admin._id).subscribe({
      next: (response: any) => {
        this.apiService.callSnack('Success delete bulletin', 'Close');
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
    const dialog = this.dialog.open(FormAddBulletinComponent, {
      width: '500px',
      maxHeight: '90vh',
      data: {
        provincies: this.provincies
      }
    });

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.resetData();
        this.getAllData();
      }
    });
  }

  onOpenEditForm (data, index) {
    const dialog = this.dialog.open(FormEditBulletinComponent, {
      width: '500px',
      maxHeight: '90vh',
      data: {
        bulletin: data,
        index: index,
        provincies: this.provincies
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
