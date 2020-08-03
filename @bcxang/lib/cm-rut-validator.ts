import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

/**
 * Devuelve un validador para el Rut.
 */
export function CmRutValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let valor: string = control.value;
    if (valor == null)
      valor = "";
    const guion: string = "-";
    let sw: boolean = false;
    const K_DIGITS: string = "0K987654321";
    let cRut: string, cDigit: string, p: string;
    let ipos: number, j: number, k: number;
    let myrut: string, cDig: string, newDig: string;

    myrut = valor.trim();
//    console.log("valor myrut:", myrut);
    if (myrut == guion || myrut.length <= 0) {
      sw = true;
    }
    else {
      // Eliminamos leading ceros
      let i: number;

      for (i = 0; i < myrut.length; i++) {
        if (myrut.substr(i, 1) != "0")
          break;
      }
      if (i < myrut.length)
        myrut = myrut.substring(i);

      // Fin eliminacion de ceros
      // separemos mantosa de digito verificador
      ipos = myrut.indexOf(guion);
      if (ipos < 0) {
        // Si no esta el guion
        cRut = myrut.substr(0, myrut.length - 1);
      } else {
        cRut = myrut.substr(0, ipos);
      }
      cDig = myrut.substr(myrut.length - 1);
      if (cRut.length > 0 && cDig.length > 0 && cDig != guion) {
        if (cRut.length < 9) {
          var myRepeat = function (str: string, n: number): string {
            let aux = "";
            for (let i = 0; i < n; i++)
              aux += str;

            return aux;
          };
          p = myRepeat("0", 9 - cRut.length) + cRut;
        }
        else
          p = cRut;

        j = (Number)(p.charAt(0)) * 4
          + (Number)(p.charAt(1)) * 3
          + (Number)(p.charAt(2)) * 2
          + (Number)(p.charAt(3)) * 7
          + (Number)(p.charAt(4)) * 6
          + (Number)(p.charAt(5)) * 5
          + (Number)(p.charAt(6)) * 4
          + (Number)(p.charAt(7)) * 3
          + (Number)(p.charAt(8)) * 2;

        k = Math.floor(j / 11);
        j = j - (k * 11);

        newDig = K_DIGITS.substr(j, 1);
        sw = newDig == cDig;
      }

    }
    return sw ? null : { 'badRut': { valor } };
  };
}
