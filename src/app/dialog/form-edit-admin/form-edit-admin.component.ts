import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DropdownInterface } from 'src/app/interfaces/dropdown.interface';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-form-edit-admin',
  templateUrl: './form-edit-admin.component.html',
  styleUrls: ['./form-edit-admin.component.css']
})
export class FormEditAdminComponent implements OnInit {
  adminForm: FormGroup;
  loader: boolean = false;
  roles: any = [];
  status: any = [];
  adminRole: any = null;
  merchants: any[] = [];
  merchantAdmin: any = [];
  formDone: boolean = false;
  provinces: DropdownInterface;
  constructor (@Inject(MAT_DIALOG_DATA) private data: any, private sharedService: SharedService, private apiService: ApiService, private dialog: MatDialog, private dialogRef: MatDialogRef<any>) {}

  ngOnInit() {
    this.fillData();
    this.makeForm();
  }

  fillData () {
    this.adminRole = this.data.rowData.role;
    this.provinces = this.data.province;
    this.roles = this.sharedService.getRoleAdmin();
    this.status = this.sharedService.getStatusAdmin();
  }

  makeForm () {
    this.adminForm = new FormGroup({
      username: new FormControl(this.data.rowData.username, [Validators.required]),
      role: new FormControl(this.data.rowData.role, [Validators.required]),
    });

    if (this.adminRole == 2) this.adminForm.addControl('province', new FormControl(this.data.rowData.province.map(val => val._id), [Validators.required]));
    else this.adminForm.removeControl('province');
  }

  onChangeRole (event) {
    this.adminRole = event.value;
    if (this.adminRole == 2) {
      const provincies = this.data.rowData ? this.data.rowData.province.map(val => val._id) : null;
      this.adminForm.addControl('province', new FormControl(provincies, [Validators.required]));
    }
    else this.adminForm.removeControl('province');
  }

  onCloseDialog () {
    this.dialogRef.close(false);
  }

  onUpdateAdmin () {
    if (this.adminForm.valid) {
      this.loader = true;
      this.dialogRef.disableClose = true;
      this.adminForm.disable();
      this.apiService.connection('POST', 'master-admin-update', this.adminForm.value, '', this.data.rowData._id).subscribe({
        next: (response: any) => {
          this.dialogRef.close(true);
          this.apiService.callSnack('Success update admin', 'Close');
          this.loader = false;
        },
        error: ({error}: HttpErrorResponse) => {
          this.loader = false;
          this.adminForm.enable();
          this.dialogRef.disableClose = false;
          this.apiService.processErrorHttp(!error.error ? error : error.error);
        }
      })
    } else {
      this.apiService.callSnack('Input not valid', 'Close');
    }
  }

}
