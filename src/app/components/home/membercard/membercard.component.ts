import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';
import { FormAddMembercardComponent } from 'src/app/dialog/form-add-membercard/form-add-membercard.component';
import { FormChangePasswordAdminComponent } from 'src/app/dialog/form-change-password-admin/form-change-password-admin.component';
import { FormConfirmationComponent } from 'src/app/dialog/form-confirmation/form-confirmation.component';
import { FormEditMembercardComponent } from 'src/app/dialog/form-edit-membercard/form-edit-membercard.component';
import { DropdownInterface } from 'src/app/interfaces/dropdown.interface';
import { MemberCardInterface } from 'src/app/interfaces/membercard.interface';
import { MemberCardPaginationInterface } from 'src/app/interfaces/membercardpagination.interface';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-membercard',
  templateUrl: './membercard.component.html',
  styleUrls: ['./membercard.component.css']
})
export class MembercardComponent implements OnInit {
  displayedColumns: String[] = ['province', 'image', 'status', 'created_at', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  totalAll: any = 0;
  provincies: DropdownInterface[]  = [];
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
    this.apiService.connection('POST', 'master-membercard', this.tableQueryData).subscribe({
      next: (response: MemberCardPaginationInterface) => {
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

  onOpenConfirmation (membercard: MemberCardInterface, type: String) {
    const dialog = this.dialog.open(FormConfirmationComponent, {
      data: {
        text: 'Are you sure you want to ' + type + ' this member card ?'
      }
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) this.deleteMemberCard(membercard);
    })
  }

  deleteMemberCard (membercard: MemberCardInterface) {
    this.apiService.connection('POST', 'master-membercard-delete', {}, '', membercard._id).subscribe({
      next: (response: any) => {
        this.apiService.callSnack('Success delete member card', 'Close');
        this.loader = false;
        this.getAllData();
      },
      error: ({error}: HttpErrorResponse) => {
        this.loader = false;
        this.apiService.processErrorHttp(!error.error ? error : error.error);
      }
    });
  }

  updateStatusAdmin (admin: MemberCardInterface, event) {
    this.apiService.connection('POST', 'master-membercard-status', { status: event.checked ? 1 : 2 }, '', admin._id).subscribe({
      next: (response: any) => {
        this.apiService.callSnack('Success update status member card', 'Close');
        this.loader = false;
        this.getAllData();
      },
      error: ({error}: HttpErrorResponse) => {
        this.loader = false;
        this.apiService.processErrorHttp(!error.error ? error : error.error);
      }
    });
  }

  onOpenChangePassword (admin: MemberCardInterface, index) {
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
    const dialog = this.dialog.open(FormAddMembercardComponent, {
      width: '500px',
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
    const dialog = this.dialog.open(FormEditMembercardComponent, {
      width: '500px',
      data: {
        membercard: data,
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
