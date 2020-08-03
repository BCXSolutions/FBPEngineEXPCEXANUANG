import { Pipe, PipeTransform } from '@angular/core';
/*
* Formatea el numero, con decimales decimales
*/
@Pipe({name: 'cmNumber'})
export class CmNumberPipe implements PipeTransform {
  transform(numero: string, decimal: number = 2): any {
    return Number(numero).toLocaleString("es-ES", { minimumFractionDigits: decimal });
   
  }
}