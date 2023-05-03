import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ProvincePaginationInterface } from 'src/app/interfaces/provincepagination.interface';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';
import { FormEditProvinceComponent } from 'src/app/dialog/form-edit-province/form-edit-province.component';
import { FormAddProvinceComponent } from 'src/app/dialog/form-add-province/form-add-province.component';
import { ProvinceInterface } from 'src/app/interfaces/province.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { FormConfirmationComponent } from 'src/app/dialog/form-confirmation/form-confirmation.component';

@Component({
  selector: 'app-province',
  templateUrl: './province.component.html',
  styleUrls: ['./province.component.css']
})
export class ProvinceComponent implements OnInit {

  displayedColumns: String[] = ['code', 'name', 'slug', 'created_at', 'action'];
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
    sort: 1,
    filter: {}
  }
  subscription: Subscription;
  isFilter: any = false;
  userRole: any = null;
  userId: any = null;

  constructor (private apiService: ApiService, private dialog: MatDialog, private router: Router, private route: ActivatedRoute) {}

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
    this.apiService.connection('POST', 'master-province', this.tableQueryData).subscribe({
      next: (response: ProvincePaginationInterface) => {
        this.tableQueryData.page = response.page;
        this.tableQueryData.limit = response.limit;
        this.tableQueryData.max = response.max;
        this.tableQueryData.total = response.total;
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

  onOpenAddForm () {
    const dialog = this.dialog.open(FormAddProvinceComponent, {
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
    const dialog = this.dialog.open(FormEditProvinceComponent, {
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

  onOpenConfirmation (province: ProvinceInterface, type: String) {
    const dialog = this.dialog.open(FormConfirmationComponent, {
      data: {
        text: 'Are you sure you want to ' + type + ' this province ?'
      }
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) this.deleteProvince(province);
    })
  }

  deleteProvince (province: ProvinceInterface) {
    this.apiService.connection('POST', 'master-province-delete', {}, '', province._id).subscribe({
      next: (response: any) => {
        this.apiService.callSnack('Success delete province', 'Close');
        this.loader = false;
        this.getAllData();
      },
      error: ({error}: HttpErrorResponse) => {
        this.loader = false;
        this.apiService.processErrorHttp(!error.error ? error : error.error);
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

  onCity (province: ProvinceInterface) {
    this.router.navigate([province._id, province.province, province.code], {
      relativeTo: this.route
    });
  }

  resetData () {
    this.tableQueryData.page = 0;
    this.tableQueryData.limit = 10;
    this.tableQueryData.total = 0;
    this.tableQueryData.search = '';
    this.tableQueryData.sort_attr = 'created_at';
    this.tableQueryData.sort = 1;
    this.tableQueryData.filter = [];
  }

  identify (item, i) {
    return item.id;
  }

}
