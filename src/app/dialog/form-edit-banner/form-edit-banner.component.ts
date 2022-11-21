import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DropdownInterface } from 'src/app/interfaces/dropdown.interface';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-form-edit-banner',
  templateUrl: './form-edit-banner.component.html',
  styleUrls: ['./form-edit-banner.component.css']
})
export class FormEditBannerComponent implements OnInit {
  formBanner: FormGroup;
  loader: boolean = false;
  statuses: DropdownInterface[] = [];
  image: string = '';
  imageShow: any = '';

  constructor (@Inject(MAT_DIALOG_DATA) private data: any, private sharedService: SharedService, private apiService: ApiService, private dialogRef: MatDialogRef<any>) { }

  ngOnInit(): void {
    this.statuses = this.sharedService.getBannerStatus();
    this.formBanner = new FormGroup({
      image: new FormControl(this.data.banner.image, [Validators.required]),
      status: new FormControl(this.data.banner.status, [Validators.required])
    });
    this.imageShow = this.data.banner.image;
  }

  onChangeFile (file: File, event) {
    this.image = file[0].name;
    this.formBanner.patchValue({
      image: file[0]
    });

    const reader = new FileReader();
    reader.readAsDataURL(file[0]);
    reader.onload = () => {
      this.imageShow = reader.result;
    };

    event.target.value = '';
  }

  onDelete () {
    this.image = '';
    this.formBanner.patchValue({
      image: ''
    });
  }

  onEditBanner () {
    if (this.formBanner.valid) {
      this.loader = true;
      this.dialogRef.disableClose = true;
      this.formBanner.disable();
      const formData = new FormData();
      formData.append('image', this.formBanner.value.image);
      formData.append('status', this.formBanner.value.status);
      this.apiService.connection('POST', 'master-banner-update', formData, '', this.data.banner._id).subscribe({
        next: (response: any) => {
          this.dialogRef.close(true);
          this.apiService.callSnack('Success create banner', 'Close');
          this.loader = false;
        },
        error: ({error}: HttpErrorResponse) => {
          this.loader = false;
          this.dialogRef.close(true);
          this.apiService.processErrorHttp(!error.error ? error : error.error);
        }
      })
    } else {
      this.sharedService.callSnack('Input not valid', 'Close');
    }
  }

}
