import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-no-data-display',
  templateUrl: './no-data-display.component.html',
  styleUrls: ['./no-data-display.component.css']
})
export class NoDataDisplayComponent implements OnInit {
  @Input('dataSource') dataSource = new MatTableDataSource<any>([]);
  @Input('loader') loader: boolean = false;
  constructor() { }

  ngOnInit(): void {}

}
