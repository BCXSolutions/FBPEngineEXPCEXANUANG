import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

/**
 * Devuelve un validador para la fecha. dd/mm/yyyy
 */
export function CmDateValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const valorIn :any = control.value;
    let isFecha :boolean ;
   let sw: boolean = false;
   let part : string[];
   let valor :string = '';
   // Si blanco o nulo, no importa
   if (valorIn == null || (typeof valorIn === "string" && valorIn.length <= 0))
    return null;
    
   if (valorIn != null) {
    if (typeof valorIn === "string")
    {
      isFecha = false;
     // 
      valor = valorIn;
      console.log("valor string:", valor);
    } else {
      isFecha = true;
      valor = valorIn.toISOString().substr(0, 10);
      console.log("valor toisostring:", valorIn.toISOString());
    }
    part = valor.split("/");
    // Si nos va mal, probamos con el otro separador
    if (part === null || part.length !== 3 )
      part = valor.split('-');

   if (part != null && part.length == 3 )
   {
      let dd: number;
      let mm: number = Number(part[1]);
      let yy: number;
      if (isFecha) {
        yy = Number(part[0]);    
        dd = Number(part[2]);
      } else {
        dd = Number(part[0]);    
        yy = Number(part[2]);

      }

     
      var to2digit = function(n: number): string {
           return ('00' + n).slice(-2);
      };
      if (! isNaN(dd) && ! isNaN(mm) && !isNaN(yy))
      {
        // A veces viene al reves: yyyy-mm-dd
        if (dd.toString().length > 2)
        {
          let aux: number = dd;
          dd = yy;
          yy = aux;
        }
        let aux: string = String(yy) + "-" + to2digit(mm) + "-" + to2digit(dd);
      console.log("aux:", aux);
        sw = !isNaN(Date.parse(aux));
      }

   }
   }
    return sw ? null : {'badfecha': {valor}} ;
  };
}
