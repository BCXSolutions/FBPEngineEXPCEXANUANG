import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

/**
 * Devuelve un validador para el texto con combo.
 */
export function CmTextoComboValidator(arr: any[], cod: string): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any}| null=> {
    const valor = control.value;
    
   let sw: boolean = false;
   if (valor == "")
      sw = true;
   else {
      for (let itm of arr) {
        if (itm[cod] == valor )
        {
          sw = true;
            break;
        }
      }
    }
    return sw ? null : {'badText': {valor}}  ;
  };
}
