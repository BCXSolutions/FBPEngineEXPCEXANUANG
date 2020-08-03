import { Directive, HostListener, Input } from '@angular/core';
import { CmUtilService } from './cm-util.service';

import { CmWindowRefService } from './cm-window-ref.service';

@Directive({
  selector: '[BcxNumero]'
})
/**
 * Seleccionar y editar un BcxNumero al momento de perder el foco.
 */
export class CmPasteDirective {
  private _window: any;
  constructor( private windowRef: CmWindowRefService
     ,  private util : CmUtilService
  ) { 
    this._window = windowRef.nativeWindow;
  }
  @Input() BcxNumero: string;
  @HostListener('paste', ['$event']) onPaste(event:any): boolean
  {
    let e :any = event;
    let data: string ;
    
    //console.log("event", e);

    let clipboardData: any = e.clipboardData;
    if (clipboardData)
      data = clipboardData.getData('Text');
    else
      data =  this._window.clipboardData.getData('Text'); //IE

    // Le quitamos los puntos y si no es numerico retornamos falso.

    let s: string = data.replace(/\./g, '');
    s = s.replace(/\,/g, '.');

    if (isNaN (Number(s)))
      return false;

     let par: [number, boolean] = this.util.getBcxNumeroPar(this.BcxNumero);

      let decimalNum :number = par[0];
      let separaSw: boolean = par[1];
 
    // metemos el valor que viene 
      let input: any = e.target;    
      let inputValue :string = input.value;
      let i = input.selectionStart;
      let j = input.selectionEnd;

      inputValue = inputValue.substring(0, i) + data +   inputValue.substring(j);

      return this.util.decimalCheck(inputValue, input.maxlength, decimalNum); 
  } 
}