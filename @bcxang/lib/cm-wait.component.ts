import {Component, Input} from '@angular/core';

@Component({
  selector: 'cm-wait',
  template: `<div *ngIf="waitShow"
    style="width: 100%; height: 100%;background-color: #333;opacity: 0.6;position: fixed;top: 0;left: 0;z-index:1">
    <mat-spinner style="position: absolute;top: 20%;left: 40%;"></mat-spinner></div>`

})
/**
 * Manejo del progress (spinner) .
 */

export class CmWaitComponent {
  constructor() {}
  @Input() 
  waitShow: boolean = false;

}
