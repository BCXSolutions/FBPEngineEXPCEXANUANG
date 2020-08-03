import { Directive, HostListener, Input } from '@angular/core';
import { CmUtilService } from './cm-util.service';
@Directive({
  selector: '[BcxNumero]'
})
/**
 * Restringir los caracteres de entrada para los numericos.
 */
export class CmKeypressDirective {

  constructor(private util : CmUtilService) { }
  @Input() BcxNumero: string;
  @HostListener('keypress', ['$event']) onKeydown(event:any): boolean
  {

    //console.log('event :', event);

    let e :any = event;
    const valid: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ','];
 
     // Para Mozilla
     const validKey: string[] = ['Backspace', 'ArrowLeft', 'ArrowRight'
     , 'Tab', 'Delete'];
    if (validKey.indexOf(e.key) >= 0)
    {
    return true;
    }
     
    if (valid.indexOf(e.key) < 0)
   {
      return false;
   }

    let par: [number, boolean] = this.util.getBcxNumeroPar(this.BcxNumero);

    let decimalNum :number = par[0];
    let separaSw: boolean = par[1];

    let comma :string =",";
    let isComma :boolean = e.key == comma;
    
      // Si es coma decimal, y  no tiene decimales o ya hay coma, mal
      let input: any = event.target;    
      let inputValue :string = input.value;

      if (isComma && (decimalNum <= 0 || inputValue.indexOf(comma) >= 0 ))
        return false;
  
        // Aca hacemos el experimento de meter el caracter que llega
        // (ya sabemos que es numero o coma )
      let i = input.selectionStart;
      let j = input.selectionEnd;

      // Lo siguiente no es "exacto", pero sirve para efectos de chequeo
      let newchar: string = e.key;
      inputValue = inputValue.substring(0, i) + newchar +   inputValue.substring(j);

      return this.util.decimalCheck(inputValue, input.maxlength, decimalNum);
      
  }
  
}