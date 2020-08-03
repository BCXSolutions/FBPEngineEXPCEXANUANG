import { Injectable }      from '@angular/core';
import {CmWsHostService, CmWsResult } from '@bcxang';
/*
 * Service : cm-rs-get.service.ts 
 * Objetivo: Llamado Generico a end point GET  REST
 * Autor   : BLC
 * Fecha   : 05/07/2020
 */
@Injectable({
    providedIn: "root"
})
export class CmRsGetService 
{
    constructor (private hostService: CmWsHostService) {}
  /**
   * Invoca a REST con GET
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
            
        this.hostService.getRest(url, data)
            .subscribe(
                result => responseFunc(result),
                error =>  errFunc(error)
            );
    }
}
