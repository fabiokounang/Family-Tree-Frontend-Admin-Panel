import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DropdownInterface } from 'src/app/interfaces/dropdown.interface';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-form-add-banner',
  templateUrl: './form-add-banner.component.html',
  styleUrls: ['./form-add-banner.component.css']
})
export class FormAddBannerComponent implements OnInit {
  formBanner: FormGroup;
  loader: boolean = false;
  statuses: DropdownInterface[] = [];
  image: string = '';
  imageShow: any = '';

  constructor (private sharedService: SharedService, private apiService: ApiService, private dialogRef: MatDialogRef<any>) { }

  ngOnInit(): void {
    this.statuses = this.sharedService.getBannerStatus();
    this.formBanner = new FormGroup({
      image: new FormControl(null, [Validators.required]),
      status: new FormControl(null, [Validators.required])
    });
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

  onAddBanner () {
    if (this.formBanner.valid) {
      this.loader = true;
      this.dialogRef.disableClose = true;
      this.formBanner.disable();
      const formData = new FormData();

      formData.append('image', this.formBanner.value.image);
      formData.append('status', this.formBanner.value.status);
      this.apiService.connection('POST', 'master-banner-create', formData).subscribe({
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
