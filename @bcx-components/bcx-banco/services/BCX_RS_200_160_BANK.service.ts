import { Injectable } from '@angular/core';
import { CmWsHostService, CmWsResult } from '@bcxang';

/*
 * Service : BCX_RS_200_160_BANK.ts 
 * Objetivo: Llamado a Web Service REST
 * Autor   : Generado por BcxWSql (BCX Solutions) a partir de BCX_RS_200_160_BANK.sql
 * Fecha   : 20/12/2019 10:54:30
 */
@Injectable({
  providedIn: 'root'
})
export class BCX_RS_200_160_BANK {

  constructor(
    private hostService: CmWsHostService
    ) {}

  /**
   * Invoca a BCX_RS_200_160_BANK
   * @param responseFunc Callback de respuesta
   * @param errFunc Callback de error
   * @param wss_cod_ing String
   * @param wss_cod_bus Number
   * @param wss_cod_bank String
   * @param wss_usercode String
   */ 
  call (
      responseFunc : ( r: CmWsResult) => void
    , errFunc : ( r: string) => void
    , wss_cod_ing: string
    , wss_cod_bus: number
    , wss_cod_bank: string
    , wss_usercode: string
	): void 
	{
    
    // URL to web Service  
    const url: string = this.hostService.getHost() + "/FBPEngineRST/FBP/BCX_RS_200_160_BANK";    
    const data: any = {
      wss_cod_ing,
      wss_cod_bus,
      wss_cod_bank,
      wss_usercode
	  };
	  
   this.hostService.getRest(url, data)
      .subscribe(
        result => responseFunc(result),
        error =>  errFunc(error)
      );
    }

}
