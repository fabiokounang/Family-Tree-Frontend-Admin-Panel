import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DropdownInterface } from 'src/app/interfaces/dropdown.interface';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-form-add-bulletin',
  templateUrl: './form-add-bulletin.component.html',
  styleUrls: ['./form-add-bulletin.component.css']
})
export class FormAddBulletinComponent implements OnInit {
  formBulletin: FormGroup;
  loader: boolean = false;
  statuses: DropdownInterface[] = [];
  image: string = '';
  imageShow: any = '';
  provincies: DropdownInterface[] = [];

  constructor (@Inject(MAT_DIALOG_DATA) private data: any, private sharedService: SharedService, private apiService: ApiService, private dialogRef: MatDialogRef<any>) { }

  ngOnInit(): void {
    this.statuses = this.sharedService.getBannerStatus();
    this.provincies = this.data.provincies;
    this.formBulletin = new FormGroup({
      title: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
      subtitle: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
      description: new FormControl(null, [Validators.required, Validators.max(3000)]),
      image: new FormControl(null, [Validators.required]),
      status: new FormControl(null, [Validators.required]),
      province: new FormControl(null, [Validators.required])
    });
  }

  onChangeFile (file: File, event) {
    this.image = file[0].name;
    this.formBulletin.patchValue({
      image: file[0]
    });
    this.sharedService.onChangeFile(file[0], (result) => {
      this.imageShow = result;
      event.target.value = '';
    });
  }

  onDelete () {
    this.image = '';
    this.formBulletin.patchValue({
      image: ''
    });
  }

  onAddBanner () {
    if (this.formBulletin.valid) {
      this.loader = true;
      this.dialogRef.disableClose = true;
      this.formBulletin.disable();
      const formData = new FormData();

      formData.append('title', this.formBulletin.value.title);
      formData.append('subtitle', this.formBulletin.value.subtitle);
      formData.append('description', this.formBulletin.value.description);
      formData.append('image', this.formBulletin.value.image);
      formData.append('status', this.formBulletin.value.status);
      formData.append('province', this.formBulletin.value.province);
      this.apiService.connection('POST', 'master-bulletin-create', formData).subscribe({
        next: (response: any) => {
          this.dialogRef.close(true);
          this.apiService.callSnack('Success create bulletin', 'Close');
          this.loader = false;
        },
        error: ({error}: HttpErrorResponse) => {
          this.loader = false;
          this.dialogRef.disableClose = false;
          this.formBulletin.enable();
          this.apiService.processErrorHttp(!error.error ? error : error.error);
        }
      })
    } else {
      this.sharedService.callSnack('Input not valid', 'Close');
    }
  }

}
