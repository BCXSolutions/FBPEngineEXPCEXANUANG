import { Injectable }     from '@angular/core';
import { CmContextData } from './cm-context-data';


@Injectable()
export class CmContextService {
  data:  CmContextData[] = [];
  userData: any;
/**
 * Guarda el contexto de una pagina.
 */
  save (data: CmContextData): void {
    if (this.data != null) {
      for (let i: number = 0; i < this.data.length; i++) {
        if (this.data[i].page == data.page) {
          this.data[i] = data;
          return;
        }
      }
    } else {
      this.data = new  Array<CmContextData> ();
    }
    this.data.push(data);

  }
  
  /**
   * Guarda el estado de la pagina.
   * @param mythis Pagina
   */
  store(mythis :any) : void
  {
   let contextData: CmContextData = new CmContextData();
		contextData.page = mythis.pageName;
    contextData.mythis = mythis;
    this.save(contextData);
  }

  /**
   * Recupera el estado de la pagina.
   * Devuelve true si habian datos para recuperar.
   * @param mythis Pagina
   */
  recover ( mythis: any): boolean {

    if (this.data != null) {
      for (let i: number = 0; i < this.data.length; i++) {
        if (this.data[i].page == mythis.pageName) {
            const ctx : CmContextData =  this.data.splice(i, 1)[0];
            for ( let obj in mythis.form.controls)
            {
              const aux: any =  mythis.form.controls[obj];
              const ori: any = ctx.mythis.form.controls[obj];
              aux.patchValue(ori.value);
              aux.updateValueAndValidity();
              if (ori.dirty)
                aux.markAsDirty();
              if (ori.touched)
                aux.markAsTouched();
              if (ori.errors != null)
                aux.setErrors(ori.errors);
              if (ori.disabled == true)
                aux.disable();

             // no funciona bien mythis.form.controls[obj] = ctx.mythis.form.controls[obj];
            }
            if (ctx.mythis.tableRows != null) {
			        mythis.tableRows = ctx.mythis.tableRows;
              mythis.tableRowsTemp = ctx.mythis.tableRowsTemp;
              if (ctx.mythis.table.sorts.length > 0)
			          mythis.table.sorts[0] = ctx.mythis.table.sorts[0];
			        mythis.tableSelected = ctx.mythis.tableSelected;
			  //      mythis.tableSort = mythis.table.sorts[0];
			        mythis.tableScroll = ctx.mythis.tableScroll;
			        mythis.tableAfterView = true;
            }

            for (let obj in ctx.mythis) 
            {
              if (obj.substr(0,3) == "cbb" && obj.substr(obj.length -5) == "Array")
                mythis[obj] =  ctx.mythis[obj];               
              //console.log(obj, ctx.mythis[obj]);
            }
            return true;
        }
      }
    }
    return false ;

  }
  
  clear() : void {
    this.data = [];
  }
  /**
   * Almacena data global.
   * @param userIndice Indice del dato.
   * @param userData Dato a guardar.
   */
  setUserData(userIndice: string, userData: any): void {
    if (this.userData == null)
      this.userData = new Map<string, any>();

    this.userData[userIndice] = userData;
    
  }
  /**
   * Recupera data global almacenada con setUserData.
   * @param userIndice Indice del dato.
   */
  getUserData(userIndice: string): any {
    if (this.userData == null)
      return "";
    return this.userData[userIndice];
  }
  
}
