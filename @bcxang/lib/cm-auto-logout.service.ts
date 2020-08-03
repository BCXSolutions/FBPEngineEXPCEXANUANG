import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Store } from "@ngrx/store";
//
import { Observable, timer } from "rxjs";
import { map, filter, switchAll } from 'rxjs/operators';
//import { CmDialogAlertComponent } from './cm-dialog-alert.component';
import { CmActivityTimeoutOccurred } from './cm-timeout.actions';  

import { CmWsHostService } from './cm-ws-host.service';
import { CmUtilService } from './cm-util.service';

import { CmIState } from "./cm-istate";

/**
 * Soporte para timeout.
 */
@Injectable()
export class CmAutoLogoutService {

    constructor(
        private store: Store<CmIState>
        , public dialog: MatDialog
        , private router: Router
        , private ngZone: NgZone
        , private hostService: CmWsHostService
        , private utilService: CmUtilService

    ) {}
    start(timeoutNumber: number) { 
        //  Observable "state" para el stream de cambios de estado
        //
        let state = this.store as Observable<CmIState>;

        //  Vamos a reaccionar frente a cambios de estado , mapeandolos a
        // un nuevo observable que emite un valor despues de que expira
        //  el timeout. 
        //
        // El runOutsideAngular es para que se puedan hacer pruebas con protactor
        
        state
            
            .pipe(
                // Solo vamos a iniciar el timer cuando el usuario este logeado 
            //  , por lo que filtramos aquellos estados (solo usamos esos).
            //
                // BLC Lo inhibimos Angular 7 filter((x: CmIState) => x.loggedIn),
            //
            // Cada vez que haya un cambio de estado generamos un  *new* 
            //  observable...para resetear el timer. En milisegundos.
            //
            map(
               
                (x: CmIState) => timer(timeoutNumber)
                
                )
            //
            // Cada vez que un  new "timeout" observable es creado queremos 
            // asegurarnos
            //  que reemplace a cualquier timer al cual estuvieramos suscritos.
            //  En otras palabras, cuando un nuevo timer parte queremos usarlo 
            //  e ignorar los anterioes.
            //
            , switchAll())
            //
            //  Finalmente necesitamos suscribirnos al observable para decidir
            //  que hacer cuando expire. 
            // Aqui solo gatillamos una accion para que el reducer decida.
            //
            .subscribe((x: any) => {
                    // Cerramos otra alerta pendiente
                    let alertRef = this.utilService.getAlertRef();
                    if (alertRef)
                        alertRef.close(0);
                     
               // console.log("Inactivity interval expired! Dispatching timeout event")
                this.store.dispatch(new CmActivityTimeoutOccurred());
                let dialogRef = this.utilService.alert(this.dialog, "Timeout");
             /*   let dialogRef = this.dialog.open(CmDialogAlertComponent,
                {height: '200px',width: '300px'});
                dialogRef.componentInstance.msg = "Timeout";
                */
                dialogRef.afterClosed().subscribe(result => {
        //  Lo mandamos al login
                    this.hostService.goInicio();
                    
                });
            
                 return 
            });       
    }
}