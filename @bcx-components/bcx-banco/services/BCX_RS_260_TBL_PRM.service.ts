
import { Injectable }from '@angular/core';
import {CmWsHostService, CmWsResult } from '@bcxang';

/*
 * Service : BCX_RS_260_TBL_PRM.ts 
 * Objetivo: Llamado a Web Service REST
 * Autor   : Generado por BcxWSql (BCX Solutions) a partir de BCX_RS_260_TBL_PRM.sql
 * Fecha   : 20/12/2019 10:54:30
 */
@Injectable({
    providedIn: "root"
})
export class BCX_RS_260_TBL_PRM 
{
    constructor (private hostService: CmWsHostService) {}
  /**
   * Invoca a BCX_RS_260_TBL_PRM
   * @param responseFunc Callback de respuesta
   * @param errFunc Callback de error
   * @param nem_tbl nemonico tabla: MONEDA, SUCURSAL, PAIS, etc...
   * @param fil_prm filtro prm
   * @param wss_usercode Usuario
   */                
    call (responseFunc : ( r: CmWsResult) => void
        , errFunc : ( r: string) => void
		, nem_tbl: string // String
		, fil_prm: string // String
		, wss_usercode: string // String
	): void 
	{
    // URL to web Service    
    const url: string = this.hostService.getHost() + '/FBPEngineRST/FBP/BCX_RS_260_TBL_PRM';  
    const data: any = {
        "nem_tbl": nem_tbl, 
        "fil_prm": fil_prm, 
        "wss_usercode": wss_usercode
	};
	  
   this.hostService.postRest(url, data)
        .subscribe(
        result => responseFunc(result),
        error =>  errFunc(error));
    }
}
