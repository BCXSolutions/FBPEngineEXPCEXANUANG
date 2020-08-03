
/**
 * Modulo raiz del proyecto.
 * BLC, 22/02/2020: Cambiamos los import {Cm*} para Angular V9 
 */
import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from "@ngrx/store";
import { HttpClientModule } from '@angular/common/http';

//import 'hammerjs';
import { CmTimeoutReducer } from './cm-timeout.reducer';
import { CmInitialState } from './cm-istate';
import { CmSharedModule } from './cm-shared.module';
import { CmDialogAlertComponent } from './cm-dialog-alert.component';
import { CmWsHostService } from './cm-ws-host.service';
import { CmUtilService } from './cm-util.service';
import { CmContextService } from './cm-context.service';
import { CmAutoLogoutService } from './cm-auto-logout.service';
import { CmWindowRefService } from './cm-window-ref.service';
import { CmBlankComponent } from './cm-blank.component';
import { CmRoutingModule } from './cm-routing.module';
import { CmAuthService } from './cm-auth.service';
import { CmAuthGuardService } from './cm-auth-guard.service';
import { CmErrorComponent } from './cm-error.component';

/**
 * IMPORTANTE: En los imports  de mas abajo, el ultimo debe ser CmRoutingModule.
 */
@NgModule({
  imports: [
    BrowserModule
    , HttpClientModule
    , CmSharedModule
    , BrowserAnimationsModule
    , StoreModule.forRoot({ timeout: CmTimeoutReducer })
    , CmRoutingModule
    , HammerModule
  ],
  declarations: [
    CmBlankComponent
    , CmErrorComponent
  ],
  entryComponents: [
    CmDialogAlertComponent
  ],

  providers: [CmWsHostService
    , CmContextService
    , CmUtilService
    , CmAutoLogoutService
    , CmWindowRefService
    , CmAuthGuardService
    , CmAuthService
    // , provideStore(CmTimeoutReducer, CmInitialState)
  ]

})
// bootstrap: [ CmMainComponent ],
export class CmModule { }