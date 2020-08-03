import {Component} from '@angular/core';

@Component({
  selector: 'cm-blank',
  template: `
  <div>
 </div>
 <cm-wait [waitShow]=waitShow></cm-wait>
 `

})
/**
 * Manejo de popup de alertas.
 */

export class CmBlankComponent {
  waitShow: boolean = true;
  constructor() {}
  
}
