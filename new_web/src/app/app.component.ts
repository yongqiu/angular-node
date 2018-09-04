import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  p1show: boolean = false;
  p2show: boolean = false;
  p3show: boolean = false;
  constructor() {
    // setTimeout(() => {
    //   this.p1show = true
    // }, 1000);
    // setTimeout(() => {
    //   this.p2show = true
    // }, 2000);
    // setTimeout(() => {
    //   this.p3show = true
    // }, 3000);
  }
}
