import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { FormAddEventComponent } from 'src/app/dialog/form-add-event/form-add-event.component';
import { FormConfirmationComponent } from 'src/app/dialog/form-confirmation/form-confirmation.component';
import { FormEditEventComponent } from 'src/app/dialog/form-edit-event/form-edit-event.component';
import { EventInterface } from 'src/app/interfaces/event.interface';
import { ProvinceInterface } from 'src/app/interfaces/province.interface';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  @ViewChild('link') link: ElementRef;
  displayedColumns: String[] = ['title', 'point', 'status', 'expired_date', 'created_at', 'action'];
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
  qr: any = '';
  urlUser: string = '';
  province: ProvinceInterface[] = [];

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
    this.apiService.connection('POST', 'master-occasion', this.tableQueryData).subscribe({
      next: (response: any) => {
        this.tableQueryData.page = response.page;
        this.tableQueryData.limit = response.limit;
        this.tableQueryData.max = response.max;
        this.totalAll = response.total;
        this.dataSource = new MatTableDataSource(response.values);
        this.province = response.province;
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

  async getBase64ImageFromUrl(imageUrl) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();

    return new Promise((resolve, reject) => {
      var reader  = new FileReader();
      reader.addEventListener("load", function () {
          resolve(reader.result);
      }, false);

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    })
  }


  async onDownload (element) {
    const qr = "https://chart.googleapis.com/chart?chs=300x300&chld=Q|0&cht=qr&chl=" + element._id;
    const result: any = await this.getBase64ImageFromUrl(qr);
    this.qr = result;
    this.link.nativeElement.href = this.qr;
    this.link.nativeElement.download = element.title;
    this.link.nativeElement.target = '_blank';
    this.link.nativeElement.click();
  }

  fixedEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[!'()*&]/g, function (c) {
      return "%" + c.charCodeAt(0).toString(16);
    });
  }

  onOpenConfirmation (occasion: EventInterface, type: String) {
    const dialog = this.dialog.open(FormConfirmationComponent, {
      data: {
        text: 'Are you sure you want to ' + type + ' this event ?'
      }
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) this.deleteEvent(occasion);
    })
  }

  deleteEvent (occasion: EventInterface) {
    this.apiService.connection('POST', 'master-occasion-delete', {}, '', occasion._id).subscribe({
      next: (response: any) => {
        this.apiService.callSnack('Success delete event', 'Close');
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
    const dialog = this.dialog.open(FormAddEventComponent, {
      width: '500px',
      data: {
        province: this.province
      }
    });

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.resetData();
        this.getAllData();
      }
    });
  }

  onOpenEditForm (element) {
    const dialog = this.dialog.open(FormEditEventComponent, {
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
