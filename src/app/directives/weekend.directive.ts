import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appWeekend]'
})
export class WeekendDirective implements OnInit {
  @Input('day') day: number;
  @Input('month') month: number;
  @Input('year') year: number;
  @Input('event') event: number;
  
  constructor (private renderer2: Renderer2, private elementRef: ElementRef) {}

  ngOnInit() {
    const date = new Date(this.year, this.month - 1, this.day - 1).getDay();
    if (date >= 5) {
      this.renderer2.setStyle(this.elementRef.nativeElement, 'color', 'red');
      if (this.event > 0) this.renderer2.setStyle(this.elementRef.nativeElement, 'color', 'blue');
      this.renderer2.setStyle(this.elementRef.nativeElement, 'fontWeight', 'bold');
    }
  }

}
