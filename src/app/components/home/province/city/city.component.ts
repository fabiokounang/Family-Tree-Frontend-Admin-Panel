import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { FormAddCityComponent } from 'src/app/dialog/form-add-city/form-add-city.component';
import { FormConfirmationComponent } from 'src/app/dialog/form-confirmation/form-confirmation.component';
import { FormEditCityComponent } from 'src/app/dialog/form-edit-city/form-edit-city.component';
import { CityInterface } from 'src/app/interfaces/city.interface';
import { CityPaginationInterface } from 'src/app/interfaces/citypagination.interface';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {
  displayedColumns: String[] = ['code', 'name', 'created_at', 'action'];
  dataSource = new MatTableDataSource<CityInterface>([]);
  id: string = '';
  province: string = '';
  loader: boolean = false;
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
  searchText: string = '';
  userRole: any = null;
  userId: any = null;
  
  constructor (private route: ActivatedRoute, private apiService: ApiService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.fillData();
    this.getAllCityByProvince();
  }
  
  fillData () {
    this.id = this.route.snapshot.params['id'];
    this.province = this.route.snapshot.params['name'];
    this.userRole = this.apiService.getLocalStorageRole();
    this.userId = this.apiService.getLocalStorageId();
  }

  getAllCityByProvince () {
    this.loader = true;
    this.apiService.connection('POST', 'master-city', this.tableQueryData, '', this.id).subscribe({
      next: (response: CityPaginationInterface) => {
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
    const dialog = this.dialog.open(FormAddCityComponent, {
      data: this.id
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) this.getAllCityByProvince();
    });
  }

  onOpenEditForm (city: CityInterface) {
    const dialog = this.dialog.open(FormEditCityComponent, {
      data: {
        id: this.id,
        rowData: city
      }
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) this.getAllCityByProvince();
    });
  }

  onOpenConfirmation (city: CityInterface, type: String) {
    const dialog = this.dialog.open(FormConfirmationComponent, {
      data: {
        text: 'Are you sure you want to ' + type + ' this city ?'
      }
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) this.deleteCity(city);
    })
  }

  deleteCity (city: CityInterface) {
    this.apiService.connection('POST', 'master-city-delete', {}, '', city._id).subscribe({
      next: (response: any) => {
        this.apiService.callSnack('Success delete city', 'Close');
        this.loader = false;
        this.getAllCityByProvince();
      },
      error: ({error}: HttpErrorResponse) => {
        this.loader = false;
        this.apiService.processErrorHttp(!error.error ? error : error.error);
      }
    });
  }

  sortData(event) {
    let sort = (event.direction == 'asc' || event.direction == '') ? 1 : 2;
    let column = event.active;
    if (sort && column) {
      this.tableQueryData.sort_attr = column;
      this.tableQueryData.sort = sort;
    }
    this.getAllCityByProvince();
  }

  onPageChange (event) {
    this.tableQueryData.page = event.pageIndex;
    this.tableQueryData.limit = event.pageSize ? event.pageSize : this.tableQueryData.limit;
    this.getAllCityByProvince();
  }

  onSearch () {
    this.tableQueryData.search = this.searchText;
    this.getAllCityByProvince();
  }

  onDetectEmpty () {
    if (!this.searchText) {
      this.resetData();
      this.getAllCityByProvince();
    }
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
