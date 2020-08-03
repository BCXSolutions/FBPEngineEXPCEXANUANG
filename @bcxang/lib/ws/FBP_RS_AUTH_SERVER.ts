
import { Injectable }      from '@angular/core';
import {
    CmWsHostService
  , CmWsResult } from '@bcxang';
/*
 * Service : FBP_RS_AUTH_SERVER.ts 
 * Objetivo: Llamado a Web Service REST
 * Autor   : Generado a partir de FBPAuthServer
 * Fecha   : 03/12/2019 10:02:34
 */
@Injectable({
  providedIn: 'root'
})
export class FBP_RS_AUTH_SERVER 
{
    constructor (private hostService: CmWsHostService) {}
  /**
   * Invoca a FBP_RS_AUTH_SERVER
   * @param responseFunc Callback de respuesta
   * @param errFunc Callback de error
   * @param header Header
   */                
  call (responseFunc : ( r: CmWsResult) => void
      , errFunc : ( r: string) => void
		  , header: string // String
	): void 
	{
	  // URL to web Service
    const url: string = this.hostService.getHost() + '/FBPAuthServer/validate/get';  
    const data: any = {
			header: header
	  };
	  
	  this.hostService.getRest(url, data)
	  .subscribe(
      result => responseFunc(result),
      error =>  errFunc(error)
    );
	}
}
