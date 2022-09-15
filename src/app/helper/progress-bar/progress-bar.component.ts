import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit {
  @Input('mode') mode: string = 'indeterminate';
  @Input('loader') loader: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
