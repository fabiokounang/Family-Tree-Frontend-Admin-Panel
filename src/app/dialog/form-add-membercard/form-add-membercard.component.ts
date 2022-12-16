import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DropdownInterface } from 'src/app/interfaces/dropdown.interface';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-form-add-membercard',
  templateUrl: './form-add-membercard.component.html',
  styleUrls: ['./form-add-membercard.component.css']
})
export class FormAddMembercardComponent implements OnInit {
  formMemberCard: FormGroup;
  loader: boolean = false;
  statuses: DropdownInterface[] = [];
  image: string = '';
  imageShow: any = '';
  provincies: DropdownInterface[] = [];
  constructor (@Inject(MAT_DIALOG_DATA) private data: any, private sharedService: SharedService, private apiService: ApiService, private dialogRef: MatDialogRef<any>) { }

  ngOnInit(): void {
    this.statuses = this.sharedService.getMemberCardStatus();
    this.provincies = this.data.provincies;
    console.log(this.data)
    this.formMemberCard = new FormGroup({
      image: new FormControl(null, [Validators.required]),
      status: new FormControl(null, [Validators.required]),
      province: new FormControl(null, [Validators.required]),
    });
  }

  onChangeFile (file: File, event) {
    this.image = file[0].name;
    this.formMemberCard.patchValue({
      image: file[0]
    });
    this.sharedService.onChangeFile(file[0], (result) => {
      this.imageShow = result;
      event.target.value = '';
    });
  }

  onDelete () {
    this.image = '';
    this.formMemberCard.patchValue({
      image: ''
    });
  }

  onAddMemberCard () {
    if (this.formMemberCard.valid) {
      this.loader = true;
      this.dialogRef.disableClose = true;
      this.formMemberCard.disable();
      const formData = new FormData();

      formData.append('image', this.formMemberCard.value.image);
      formData.append('status', this.formMemberCard.value.status);
      formData.append('province', this.formMemberCard.value.province);
      this.apiService.connection('POST', 'master-membercard-create', formData).subscribe({
        next: (response: any) => {
          this.dialogRef.close(true);
          this.apiService.callSnack('Success create member card', 'Close');
          this.loader = false;
        },
        error: ({error}: HttpErrorResponse) => {
          this.loader = false;
          this.dialogRef.disableClose = false;
          this.formMemberCard.enable();
          this.apiService.processErrorHttp(!error.error ? error : error.error);
        }
      })
    } else {
      this.sharedService.callSnack('Input not valid', 'Close');
    }
  }

}
