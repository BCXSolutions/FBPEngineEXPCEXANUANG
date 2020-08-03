import { NgModule }from '@angular/core';
import { RouterModule, Routes} from '@angular/router';

import { BcxBancoComponent } from './bcx-banco.component';
import { ConsultaBancoComponent } from './consulta-banco.component';
import { PlazaBancosComponent } from './plaza-banco.component';

const appRoutes: Routes = [
  { path: 'bcxBanco', component: BcxBancoComponent },
  { path: 'consultaBanco', component: ConsultaBancoComponent },
  { path: 'consultaPlaza', component: PlazaBancosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],  
  exports: [RouterModule]
})
export class BcxBancoRoutingModule {}
