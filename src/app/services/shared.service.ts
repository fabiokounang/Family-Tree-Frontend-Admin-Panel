import { Injectable } from "@angular/core";
import { HttpRequest, HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import HttpList from '../utils/http-list';
import { Meta } from '@angular/platform-browser';
import { DropdownInterface } from "../interfaces/dropdown.interface";

@Injectable({
  providedIn: 'root'
})

export class SharedService {
  private roleAdmin: DropdownInterface[] = [
    {id: 1, name: 'Superadmin'},
    {id: 2, name: 'Admin'}
  ];

  private statusAdmin: DropdownInterface[] = [
    {id: 1, name: 'Active'},
    {id: 2, name: 'Not Active'}
  ];

  private statusUser: DropdownInterface[] = [
    {id: 1, name: 'Active'},
    {id: 2, name: 'Not Active'}
  ];

  private statusBanner: DropdownInterface[] = [
    {id: 1, name: 'Active'},
    {id: 2, name: 'Not Active'}
  ];

  private statusMemberCard: DropdownInterface[] = [
    { id: 1, name: 'Active' },
    { id: 2, name: 'Not Active' },
  ]

  private gender: DropdownInterface[] = [
    { id: 1, name: 'Male' },
    { id: 2, name: 'Female' }
  ];

  private lifeStatus: DropdownInterface[] = [
    { id: 1, name: 'Dead' },
    { id: 2, name: 'Alive' }
  ];

  private occasionType: DropdownInterface[] = [
    { id: 1, name: 'Add' },
    { id: 2, name: 'Decrease' }
  ]

  private scopes: DropdownInterface[] = [
    { id: 1, name: 'Local Add Point' },
    { id: 2, name: 'Local Redeem Point' },
    { id: 3, name: 'National Redeem Point' }
  ]

  private moons: DropdownInterface[] = [
    { id: 1, name: 'Purnama' },
    { id: 2, name: 'Mati' }
  ]

  errGeneral: string = 'Something went wrong, please try again';

  constructor (private httpClient: HttpClient, private snack: MatSnackBar, private meta: Meta) {}

  getRoleAdmin () {
    return this.roleAdmin;
  }

  getStatusAdmin () {
    return this.statusAdmin;
  }

  getStatusUser () {
    return this.statusUser;
  }

  getLifeStatus () {
    return this.lifeStatus;
  }

  getGender () {
    return this.gender;
  }

  getBannerStatus () {
    return this.statusBanner;
  }

  getOccasionType () {
    return this.occasionType;
  }

  getScopes () {
    return this.scopes;
  }

  getMoons () {
    return this.moons;
  }

  getMemberCardStatus () {
    return this.statusMemberCard;
  }

  onChangeFile (file, callback) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => callback(reader.result);
  }

  async callSnack (text: string, action: string) {
    this.snack.open(text, action, {
      duration: 3000
    });
  }
}
