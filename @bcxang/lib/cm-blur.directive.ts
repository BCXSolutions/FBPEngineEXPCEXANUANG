import { Directive, HostListener, Input } from '@angular/core';
import { CmUtilService } from './cm-util.service';
@Directive({
  selector: '[BcxNumero]'
})
/**
 * Seleccionar y editar un BcxNumero al momento de perder el foco.
 */
export class CmBlurDirective {

  constructor(private util : CmUtilService) { }
  /**
   * De la forma par1=value1;par2=value2;...
   */
  @Input() BcxNumero: string;
  @HostListener('blur', ['$event']) onBlur(event:any): boolean
  {

      let par: [number, boolean] = this.util.getBcxNumeroPar(this.BcxNumero);

      let decimalNum :number = par[0];
      let separaSw: boolean = par[1];
     
      let input: any = event.target;    
      let s :string = input.value;
      // TODO
      // Le cambiamos coma decimal por punto
        s = s.replace(/\,/g, '.');
      // Editamos. Puntos de miles y coma decimal
        input.value =  Number(s).toLocaleString("es-ES"
              , { minimumFractionDigits: decimalNum });
      
      if (!separaSw)
      {
        s  =  input.value;
        input.value = s.replace(/\./g, '');      
      }
     
      if (input.value == "")
        input.value = "0";
        
      return true;
  }
  
}