import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DropdownInterface } from 'src/app/interfaces/dropdown.interface';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-form-add-user',
  templateUrl: './form-add-user.component.html',
  styleUrls: ['./form-add-user.component.css']
})
export class FormAddUserComponent implements OnInit {
  userForm: FormGroup;
  loader: boolean = false;
  statuses: DropdownInterface[] = [];
  genders: DropdownInterface[] = [];
  lifeStatus: DropdownInterface[] = [];
  eyePassword = 'visibility';
  typePassword = 'password';
  eyeConfirmPassword = 'visibility';
  typeConfirmPassword = 'password';
  province: any = [];
  cities: any = [];
  selectedProvince: any = null;
  selectedCity: any = null;
  load: boolean = false;

  constructor (private sharedService: SharedService, private apiService: ApiService, private dialog: MatDialog, private dialogRef: MatDialogRef<any>) {}

  ngOnInit() {
    this.getAllProvince();
    this.fillData();
    this.makeForm();
  }

  getAllProvince () {
    this.loader = true;
    this.apiService.connection('POST', 'master-province', { limit : 2000 }).pipe(map((value: any) => {
      return this.helperMapDropdown(value);
    })).subscribe({
      next: (response: any) => {
        this.province = response;
        this.load = true;
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

  onSelectProvince (province) {
    this.loader = true;
    this.selectedProvince = province.value.id;
    this.apiService.connection('POST', 'master-city', {}, '', this.selectedProvince).pipe(map((value: any) => {
      return this.helperMapDropdown(value);
    })).subscribe({
      next: (response: any) => {
        this.cities = response;
        if (this.selectedProvince && this.cities.length > 0) this.userForm.get('city_of_residence').enable();
        else this.userForm.get('city_of_residence').disable();
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

  fillData () {
    this.statuses = this.sharedService.getStatusUser();
    this.genders = this.sharedService.getGender();
    this.lifeStatus = this.sharedService.getLifeStatus();
  }

  makeForm () {
    this.userForm = new FormGroup({
      fullname: new FormControl(null, [Validators.required, Validators.maxLength(30)]),
      email: new FormControl(null, [Validators.required]),
      nik: new FormControl(null, [Validators.required, Validators.minLength(16), Validators.maxLength(16)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
      confirmation_password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
      status: new FormControl(null, [Validators.required]),
      gender: new FormControl(null, [Validators.required]),
      // first_name_latin: new FormControl(null, [Validators.required, Validators.maxLength(200)]),
      // last_name_latin: new FormControl(null, [Validators.required, Validators.maxLength(200)]),
      // chinese_name: new FormControl(null, [Validators.required, Validators.maxLength(200)]),
      // life_status: new FormControl(null, [Validators.required]),
      // address: new FormControl(null, [Validators.required, Validators.maxLength(300)]),
      // date_of_birth: new FormControl(null, [Validators.required]),
      place_of_birth: new FormControl(null, [Validators.required]),
      city_of_residence: new FormControl({ value: null, disabled: true }, [Validators.required]),
      // phone: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(14)]),
      // wechat: new FormControl(null, [Validators.minLength(10), Validators.maxLength(14)]),
      // postal_address: new FormControl(null, [Validators.required, Validators.maxLength(6)]),
      // remark: new FormControl(null)
    });
  }

  onCloseDialog () {
    this.dialogRef.close(false);
  }

  onAddUser () {
    if (this.userForm.valid) {
      this.loader = true;
      this.dialogRef.disableClose = true;
      this.userForm.disable();
      this.userForm.value.date_of_birth = new Date(this.userForm.value.date_of_birth).getTime();
      this.userForm.value.place_of_birth = this.selectedProvince;
      this.apiService.connection('POST', 'master-user-create', this.userForm.value).subscribe({
        next: (response: any) => {
          this.dialogRef.close(true);
          this.apiService.callSnack('Success create user', 'Close');
          this.loader = false;
        },
        error: ({error}: HttpErrorResponse) => {
          this.loader = false;
          this.apiService.processErrorHttp(!error.error ? error : error.error);
        }
      })
    } else {
      this.apiService.callSnack('Input not valid', 'Close');
    }
  }

  onToggle (eye, type) {
    this[eye] = this[eye] == 'visibility' ? 'visibility_off' : 'visibility';
    this[type] = this[type] == 'password' ? 'text' : 'password';
  }

  helperMapDropdown (value) {
    return value.values.map((val) => {
      return {
        id: val._id,
        name: val.province || val.city,
        code: val.code
      }
    });
  }

}
