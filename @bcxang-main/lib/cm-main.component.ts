import { Component, Input, OnInit } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { Store } from "@ngrx/store";
import { Location } from '@angular/common';
import { ViewportScroller } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
//import * as parse from "xml-parser";
import { Observable, fromEvent } from "rxjs";
import { filter } from "rxjs/operators";

import { CmReset, CmUserLoggedIn } from '@bcxang';
import { CmIState } from '@bcxang';
import { CmUtilService } from '@bcxang';
import { CmWsHostService } from '@bcxang';
import { CmAutoLogoutService } from '@bcxang';
import { environment } from '../../src/environments/environment';
import { CmWindowRefService } from '@bcxang';
/**
 * Punto de inicio. En el template router-outlet
 * se carga el primer componente al cual navegamos.
 */
@Component({

  selector: 'cm-app',
  template: '<router-outlet></router-outlet>'

})
/**
 * Entry point de la aplicacion.
 * Cargamos las definiciones del proyecto.
 */
export class CmMainComponent implements OnInit {
  errorMessage: string;
  // Para anular el timeout
  mouseMoves: Observable<Event>;
  //mouseClick: Observable<Event>;

  keyPresed: Observable<Event>;
  //main: string;

  constructor(private hostService: CmWsHostService
    , private router: Router
    , private location: Location
    , private dialog: MatDialog
    , private cmAutoLogoutService: CmAutoLogoutService
    , private store: Store<CmIState>
    , private utilService: CmUtilService
    , private windowRefService: CmWindowRefService
    , private viewportScroller: ViewportScroller        
  ) {

    this.router.events.pipe(filter(e => e instanceof Scroll)).subscribe((e: any) => {
      console.log(e);    
      // this is fix for dynamic generated(loaded..?) content
      setTimeout(() => {
        if (e.position) {
          this.viewportScroller.scrollToPosition(e.position);
        } 
        else if (e.anchor) {
          this.viewportScroller.scrollToAnchor(e.anchor);
        } 
        else {
          this.viewportScroller.scrollToPosition([0, 0]);
        }
      });
    });
   }

  public ngOnInit() {
    // Cargamos la definicion

    // this.main  = this.elm.nativeElement.getAttribute('main');
   // los parametros , por ejemplo: ?usr=abc&pass=cde
   let params: string = location.search;

   // creamos un arreglo con los parametros que vienen en le URL (por ejemplo, user y passwd)

   let queryParams: any = this.parseQuery(params);
   this.utilService.setQueryParams(queryParams);
   let token :string = queryParams["token"];
   // let token :string = this.route.snapshot.paramMap.get("userType")
  
     let errToken: string = "";
   
       
       if (token != "" && typeof token != "undefined") {
         // veamos si es un token valido
         this.hostService.setToken(token);
         if (!this.hostService.isValidToken()) {
           errToken = "Token inválido.";
         }
       
     } else
           errToken = "Debe venir un token en la URL";
       if (errToken.length > 0) {
           // Nos vamos a la URL llamadora
          /* const callerURL: string = this.hostService.getConfig("preferences/caller-url")
             + "?error=" + errToken;

           let w = this.windowRefService.nativeWindow;
           w.location.href = callerURL;
*/
           this.router.navigate(['cm-error']);
         }
 

    this.hostService.defLoad("configuration.xml").subscribe(
      xml => this.procXml(xml),
      error => this.openDialogAlert(<string>error)
    );

  }
  /**
   * Obtenemos los parametros iniciales a partir del xml.
   */
  private procXml(strXml: string): void {

  
    // Aca partimos
    let host: string;


    if (environment.production) {
      host = location.origin;
    } else {
      host = environment.host;
    }

    this.hostService.setHost(host);
    // busquemos las preferences
    this.hostService.setConfig(strXml);
    const ruta: string = this.hostService.getConfig("preferences/webservice/ruta");
    const servidor: string = this.hostService.getConfig("preferences/serverconnection/servidor");
    const puerto: string = this.hostService.getConfig("preferences/serverconnection/puerto");;

    this.hostService.setRuta(ruta);
    this.hostService.setPuerto(puerto);
    this.hostService.setServidor(servidor);

   

    // busqueda en configuration.xml la variable de activacion de login.
    const activateLogin: string = this.hostService.getConfig("preferences/activatelogin");

    // Como lo anterior es asincrono, recien ahora podemos 
    // empezar el proceso

    //this.router.navigate([""]);

    // Inicializamos el timeout
    let timeoutNumber: number = 60000;
    let timeout: string = this.hostService.getConfig("preferences/timeout");
    if (timeout != null && !isNaN(Number(timeout)))
      timeoutNumber = Number(timeout);

    if (timeoutNumber > 0) {
      this.store.dispatch(new CmUserLoggedIn());
      this.cmAutoLogoutService.start(timeoutNumber);

      // Creamos un observable para los movimientos del mouse
      this.mouseMoves = fromEvent(document, 'mousemove');
      this.mouseMoves.subscribe(event => {
        // Para evitar el timeout
        //  console.log("event", event);
        this.store.dispatch(new CmReset());
        // console.log('logging mousemove');
      });

      // Creamos un observable para el teclado

      this.keyPresed = fromEvent(document, 'keypress');
      this.keyPresed.subscribe(event => {
        // Para evitar el timeout
        this.store.dispatch(new CmReset());

      });
    }

  }

  /**
  private alertResult(result: number) {
    this.hostService.goInicio();
  }
  */
  private openDialogAlert(msg: string) {

    // Des Activamos el simbolo de progress
    this.utilService.alert(this.dialog, msg);
    this.hostService.goInicio();
  }

  private parseQuery(qstr: string): any {
    let query = {};
    let a = (qstr[0] === '?' ? qstr.substr(1) : qstr).split('&');
    for (let i = 0; i < a.length; i++) {
      let b = a[i].split('=');
      query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
    }
    return query;
  }

}
