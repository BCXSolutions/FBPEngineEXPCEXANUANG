import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[BcxNumero]'
})
/**
 * Seleccionar y editar un BcxNumero al momento de recibir el foco.
 */
export class CmFocusDirective {

  constructor() { }
  @Input() BcxNumero: string;
  @HostListener('focus', ['$event']) onFocus(event:any): boolean
  {
      let input: any = event.target;
     
      // Eliminamos todo lo que no sea caracter separador decimal
   
      let s :string = input.value;
      //TODO:
      s = s.replace(/\./g, '');
      input.value = s;
      input.select();
    
      return true;
  }
  
}