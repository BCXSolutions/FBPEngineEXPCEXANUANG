import { NgModule } from '@angular/core';  
import { CmModule } from '@bcxang';  
import { CmSharedModule } from '@bcxang';  
import { CmMainComponent } from '@bcxang-main';  
import { AppUserRoutingModule } from './app-user-routing.module';  

import { BcxBancoModule } from '@bcx-components';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

import { SafeHtmlComPipe, ComisionesComponent } from './comisiones.component';

/**  
 * Lista Componentes (paginas). Reemplazar por las propias.    
 */  
import { AnularCobranzaComponent } from './anularCobranza.component';


/**  
  *  En "declarations:", mantener "CmMainComponent" y reemplazar el resto por los componentes propios.  
  *  En "providers", reemplazar por los Web Services propios.  
  */    
@NgModule({  
  imports: [  
      CmSharedModule  
    , AppUserRoutingModule  
    , CmModule 
    , BcxBancoModule, BrowserAnimationsModule  
  ],  
  declarations: [  
      CmMainComponent  
    , AnularCobranzaComponent   
    , ComisionesComponent 
    , SafeHtmlComPipe
  ],  
  exports: [CmSharedModule],  
  bootstrap: [CmMainComponent],  
  providers: []  
})  
export class AppUserModule { }