import { NgModule }  from '@angular/core';  
import { RouterModule, Routes, CanActivate } from '@angular/router'; 
import { CmAuthGuardService } from '@bcxang';
import { CmErrorComponent } from '@bcxang';  

/**  
 * Lista de componentes.  
 */  
import { AnularCobranzaComponent } from './anularCobranza.component'; 
import { ComisionesComponent } from './comisiones.component'; 

/**   
 * Lista de Componentes y sus path.
 */  
const appRoutes: Routes = [  
	  { path: 'cm-error', component: CmErrorComponent }  
  , { path: '', component: AnularCobranzaComponent, canActivate: [CmAuthGuardService]}  
  
    // Ruta de Comisiones
	, { path: 'comisiones/:numOpe/:codIng/:codPro/:codEve', component: ComisionesComponent, canActivate: [CmAuthGuardService]}

];  

@NgModule({  
  imports: [RouterModule.forChild(appRoutes)],   
  exports: [RouterModule]  
}) 
export class AppUserRoutingModule {}