import {Component, Input, NgModule} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon'; 

@Component({
  selector: 'cm-dialog-alert',
  template: `
  <div class="cm-dialog-title">{{title}}</div>
<div mat-dialog-content class="cm-dialog-content">
<div *ngIf="isHelp; else elseBlock">
<span class="cm-help-msg">{{ msg }}</span>
 <div class="cm-help-version">Version: {{helpVersion}}</div>
 <div class="cm-help-date">Fecha: {{helpDate}}</div>
</div>
<ng-template #elseBlock>
<span>{{ msg }}</span>
</ng-template>
</div>
<div class="cm-dialog-actions">

<button  mat-raised-button (click)="dialogRef.close(1)"><mat-icon>check</mat-icon>Aceptar</button>

<button *ngIf="tipoAlerta > 0" mat-raised-button (click)="dialogRef.close(0)"><mat-icon>close</mat-icon>Cancelar</button>

 </div>
 <div *ngIf="isHelp" class="cm-help-footer">
 <div  class="cm-help-copyright">{{helpCopyright}}</div>
 <div class="cm-help-module">{{helpModule}}</div>
 
 </div>
 `

})
/**
 * Manejo de popup de alertas.
 */

export class CmDialogAlertComponent {
  constructor(public dialogRef: MatDialogRef<CmDialogAlertComponent>) {}
  @Input() 
  msg: string;
  @Input() 
  title: string;
  @Input()
  tipoAlerta: number = 0;
  @Input()
  isHelp: boolean = false;
  @Input()
  helpModule :string = "";
  @Input()
  helpDate :string = "";
  @Input()
  helpVersion :string = "";
  @Input()
  helpCopyright :string = "";

   ngOnInit() {
     if (!this.title || this.title.length <= 0)
     this.title = "Mensaje";
   }
}
