/** Este modulo debe ser modificado para agregar
 * rutas a componente propios en el arreglo  appRoutes de mas abajo.
 */
import { NgModule }             from '@angular/core';
import { RouterModule, Routes , PreloadingStrategy, PreloadAllModules} from '@angular/router';
import { CmBlankComponent } from './cm-blank.component';

/** El primero que aparece es el de inicio */
const appRoutes: Routes = [
  { path: 'cm-init', loadChildren: () => import('../../src/app/app-user.module').then(m => m.AppUserModule) }
    // Para la primera vez
   ,{ path: 'index.html', component: CmBlankComponent}

 
];

@NgModule({
 // imports: [RouterModule.forRoot(appRoutes,  { preloadingStrategy: PreloadAllModules })],
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class CmRoutingModule {}
