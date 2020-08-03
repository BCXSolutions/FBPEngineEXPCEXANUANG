import { Directive, HostListener, Input } from '@angular/core';
@Directive({
  selector: '[CmRestrict]'
})
/**
 * Restringir los caracteres de entrada de 0 a 9.
 */
export class CmRestrictDirective {

  constructor() { }
  @Input() CmRestrict: string;
  @HostListener('keypress', ['$event']) onKeydown(event:any): boolean
  {
    const valid: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
   
  // Para Mozilla
  const validKey: string[] = ['Backspace', 'ArrowLeft', 'ArrowRight'
  , 'Tab', 'Delete'];
 if (validKey.indexOf(event.key) >= 0)
 {
 return true;
 }


    return valid.indexOf(event.key) >= 0;
       
  }
  
}