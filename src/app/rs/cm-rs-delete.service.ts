import { Injectable }      from '@angular/core';
import {CmWsHostService, CmWsResult } from '@bcxang';
/*
 * Service : cm-rs-delete.service.ts 
 * Objetivo: Llamado Generico a end point DELETE REST
 * Autor   : BLC
 * Fecha   : 05/07/2020
 */
@Injectable({
    providedIn: "root"
})
export class CmRsDeleteService
{
    constructor (private hostService: CmWsHostService) {}
  /**
   * Invoca a REST con DELETE
   * @param rsName No,bre del Rest Service
   * @param responseFunc Callback de respuesta
   * @param errFunc Callback de error
   * @param data Objeto con datos
   */                
    call = ( rsName : string
        , responseFunc : ( r: CmWsResult) => void
        , errFunc : ( r: string) => void
        , data: any 
	): void =>
	{
        // URL to REST Service
        const url: string = this.hostService.getRuta() + '/FBP/' + rsName;  
            
        this.hostService.deleteRest(url, data)
            .subscribe(
                result => responseFunc(result),
                error =>  errFunc(error)
            );
    }
}
