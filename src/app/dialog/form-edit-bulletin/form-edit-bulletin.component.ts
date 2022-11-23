import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DropdownInterface } from 'src/app/interfaces/dropdown.interface';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-form-edit-bulletin',
  templateUrl: './form-edit-bulletin.component.html',
  styleUrls: ['./form-edit-bulletin.component.css']
})
export class FormEditBulletinComponent implements OnInit {

  formBulletin: FormGroup;
  loader: boolean = false;
  statuses: DropdownInterface[] = [];
  image: string = '';
  imageShow: any = '';

  constructor (@Inject(MAT_DIALOG_DATA) private data: any, private sharedService: SharedService, private apiService: ApiService, private dialogRef: MatDialogRef<any>) { }

  ngOnInit(): void {
    this.statuses = this.sharedService.getBannerStatus();

    this.formBulletin = new FormGroup({
      title: new FormControl(this.data.bulletin.title, [Validators.required, Validators.maxLength(255)]),
      subtitle: new FormControl(this.data.bulletin.subtitle, [Validators.required, Validators.maxLength(500)]),
      description: new FormControl(this.data.bulletin.description, [Validators.required, Validators.max(1500)]),
      image: new FormControl(this.data.bulletin.image, []),
      status: new FormControl(this.data.bulletin.status, [Validators.required])
    });
    this.imageShow = this.data.bulletin.image;
  }

  onChangeFile (file: File, event) {
    this.formBulletin.get('image').addValidators(Validators.required);

    this.image = file[0].name;
    this.formBulletin.patchValue({
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
    this.formBulletin.patchValue({
      image: ''
    });
  }

  onEditBulletin () {
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
      this.apiService.connection('POST', 'master-bulletin-update', formData, '', this.data.bulletin._id).subscribe({
        next: (response: any) => {
          this.dialogRef.close(true);
          this.apiService.callSnack('Success update bulletin', 'Close');
          this.loader = false;
        },
        error: ({error}: HttpErrorResponse) => {
          this.dialogRef.disableClose = false;
          this.loader = false;
          this.formBulletin.enable();
          this.apiService.processErrorHttp(!error.error ? error : error.error);
        }
      })
    } else {
      this.sharedService.callSnack('Input not valid', 'Close');
    }
  }


}
