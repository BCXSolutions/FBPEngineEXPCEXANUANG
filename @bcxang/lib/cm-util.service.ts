import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as parse from "xml-parser";
import { CmDialogAlertComponent } from './cm-dialog-alert.component';
import { CmWsHostService } from './cm-ws-host.service';


/**
 * Soporte utilitarios varios.
 */
@Injectable()
export class CmUtilService {

  public YES: number = 1;
  private queryParams: any = {};

  private alertRef: any = null;
  private tableClicks: number = 0;
  private tableTimer: any;

  constructor(private hostService: CmWsHostService) { }

  /**
   * Recibe una fecha larga. Devuelve dd/mm/yyyy
   * @param fecha larga
   */
  editDateText(fecha: string): string {
    let aux: string = fecha.substr(0, 10);
    const sep: string = "/";
    return aux.substring(8) + sep
      + aux.substr(5, 2) + sep
      + aux.substr(0, 4);
  }
  editDate(fecha: string): string {
    return fecha.substr(0, 10);
  }
  /**
   * Devuelve el numero editado con puntos de miles y coma decimal.
   * @param numero Numro de entrada, con decimales
   */
  editNumber(numero: number, decimal: number = 2): string {
    return (Number(numero).toLocaleString("de-DE", { minimumFractionDigits: decimal })).toString();

  }



  setQueryParams(params: any) {
    this.queryParams = params;
  }
  getQueryParams(): any {
    return this.queryParams;
  }


  alert(dialog: MatDialog, msg: string, callback?: any): any {

    return this.alertEx(dialog, msg, 0, "", callback);
  }
  deleteConfirm(dialog: MatDialog, msg: string, callback) {
    let aux: string = "¿Está seguro de eliminar el registro indicado?";
    if (msg.length > 0)
      aux = aux.replace("registro", msg);
    this.alertEx(dialog
      , aux
      , 1
      , ""
      , callback);
  }

  deleteConfirmGeneric(dialog: MatDialog, msg: string, callback) {
    let aux: string = "¿Está seguro de eliminar registro";
    if (msg.length > 0)
      aux = aux.replace("registro", msg);
    this.alertEx(dialog
      , aux
      , 1
      , ""
      , callback);
  }

  confirm(dialog: MatDialog, msg: string, callback) {

    this.alertEx(dialog, msg, 1, "", callback);
  }
  /**
   * Apoyo a directivas de BcxNumero.
   * @param inputValue 
   * @param maxlength 
   * @param decimalNum 
   */
  decimalCheck(inputValue: string, maxlength: number, decimalNum: number): boolean {
    let comma: string = ",";
    let k: number = inputValue.indexOf(comma);

    // No mas de una coma
    if (k != inputValue.lastIndexOf(comma))
      return false;

    // Veamos si nos pasamos en decimales
    if (k >= 0) {
      if (inputValue.length - k - 1 > decimalNum)
        return false;
    }
    // Parte entera: no mas de maxchars - decimales -1

    if (maxlength > 0) {
      let parteEntera: string = (k >= 0) ? inputValue.substring(0, k) : inputValue;

      if (parteEntera.length > maxlength + decimalNum + 1)
        return false;
    }
    return true;
  }
  /**
   * Parsea y devuelve los parametros de BcxNumero.
   * @param p 
   */
  getBcxNumeroPar(p: string): [number, boolean] {
    let out: [number, boolean] = [0, true];
    if (p) {

      let arr: string[] = p.split(";");
      for (let par of arr) {
        let params: string[] = par.split("=");
        let attr: string = params[0].toLowerCase().trim();
        let val: string = params[1].toLowerCase().trim();
        if (attr == "separador" && val == "false")
          out[1] = false;
        else if (attr == "decimal")
          out[0] = Number(val);
      }
    }
    return out;
  }
  /**
   * callback de los botones help de la aplicacion
   */
  cmdHelp_click(dialog): any {
    // busquemos las preferences

    const helpMsg: string = this.hostService.getConfig("preferences/acerca-de/titulo");
    const helpTitle: string = "Acerca de";
    const helpVersion: string = this.hostService.getConfig("preferences/acerca-de/version");
    const helpModule: string = this.hostService.getConfig("preferences/acerca-de/nombreWar");
    const helpDate: string = this.hostService.getConfig("preferences/acerca-de/fecha");
    const helpCopyright: string = this.hostService.getConfig("preferences/acerca-de/derechos");
    const tipoDialog: number = 0;

    let dialogRef: MatDialogRef<CmDialogAlertComponent> = dialog.open(CmDialogAlertComponent,
      { width: '350px', height: 'auto' });
    dialogRef.componentInstance.msg = helpMsg;
    dialogRef.componentInstance.title = helpTitle;
    dialogRef.componentInstance.isHelp = true;
    dialogRef.componentInstance.helpVersion = helpVersion;
    dialogRef.componentInstance.helpModule = helpModule;
    dialogRef.componentInstance.helpDate = helpDate;
    dialogRef.componentInstance.tipoAlerta = tipoDialog;
    this.alertRef = dialogRef;
    dialogRef.afterClosed().subscribe(result => {
      this.alertRef = null;

    });

    return dialogRef;

  }
  private alertEx(dialog: MatDialog, msg: string, tipoDialog: number, title: string, callback?: any): MatDialogRef<CmDialogAlertComponent> {

    let dialogRef: MatDialogRef<CmDialogAlertComponent> = dialog.open(CmDialogAlertComponent,
      { width: '350px', height: 'auto', disableClose: true });
    dialogRef.componentInstance.msg = msg;
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.tipoAlerta = tipoDialog;
    this.alertRef = dialogRef;
    dialogRef.afterClosed().subscribe(result => {
      this.alertRef = null;
      if (callback) callback(result);
    });

    return dialogRef;

  }

  /**
   * Devuelve referencia a la ultima alerta desplegada, o null.
   */
  getAlertRef(): any {
    return this.alertRef;
  }
  /**
   * Manejo de posicion de scroll. 
   * @param table 
   * @param tableScroll
   * @param afterView 
   */
  scrollPos(table: any, tableScroll: number, afterView: boolean): boolean {
    if (!afterView)
      return afterView;
    let scroller = table.bodyComponent.scroller;
    if (!scroller)
      return afterView;

    if (table.bodyHeight > 0) {
      scroller.setOffset(tableScroll);
      afterView = false;
    }

    return afterView;
  }

  /** No funciona desde version > 6
   * Manejador del evento change de los combos asociados a textos.  
   * 
   * @param event El evento original
   * @param comp El componente (this)
   * @param text El nombre del texto asociado
   */
  comboTexto_change(event, comp, text: string): void {
    comp.form.controls[text].patchValue(event.value);
  }
  /**
   * Llamado cuando cambia la seleccion del combo asociado.  
   * @param controlTxt El input text
   * @param value El valor
   */
  comboTexto_changeSelect(controlTxt: any, value: string): void {
    if (controlTxt.value !== value)
      controlTxt.patchValue(value);
  }
  /**
   * Llamado cuando cambia el texto del input asociado.  
   * @param combo El combo
   * @param value El valor
   */
  textoCombo_change(combo: any, value: string): void {
    if (combo.value !== value)
      combo.patchValue(value);
  }

  /**
   * DEPRECADO
   * Manejador del evento keyup de los textos asociados a combos.
   * @param event El evento original
   * @param comp El componente (this)
   * @param cbb El nombre del combo asociado
   */
  textoCombo_keyup(event, comp, cbb: string): void {
    let input: any = event.target;
    //	const nombreText: string = input.attributes['formcontrolname'].value;
    //	const nombreCbox: string = 'cbb' + nombreText.substr(3);
    comp.form.controls[cbb].patchValue(input.value);

  }
  /**
   * Manejador del evento blur de los textos asociados a combos.
   * @param event Evento original
   * @param comp Componente (this)
   * @param arr Arreglo con los datos del combo asociado
   * @param cod Nombre de la variable codigo dentro del arreglo
   */
  textoCombo_blur(event, comp, arr: any[], cod: string): void {
    let input: any = event.target;


    for (let itm of arr) {
      if (itm[cod] == input.value)
        return;
    }
    let msg: string = "Valor [" + input.value + "] incorrecto";
    this.alert(comp.dialog, msg);
  }

  /**
   * Convierte la entrada a un decimal valido.
   * @param s numero de entrada, editado con puntos y miles.
   */
  toDecimal(s: string): string {
    let re: RegExp = /\./g;
    let out: string = s.replace(re, "");
    out = out.replace(",", ".");

    return out;
  }
  /**
   * Convierte la entrada Date a YYYY-MM-DD.
   * Usa un default si viene en blanco o nulo
   * @param fecha fecha de entrada.(biblioteca moment.js())
   */
  toDate(fecha: any): string {

    if(fecha == null ||  (typeof fecha === "string" && fecha.length <= 0) )
      return this.getFechaDefault();
    // A veces fecha viene como string
    if (typeof fecha === "string")
      return fecha;

    return fecha.format('YYYY-MM-DD');

    /**
    let fechaDate: any;
    try {
      // Intentamos crear el objeto DATE a partir del DATE recibido.
      fechaDate = new Date(fecha.toUTCString());
    } catch (error) {
      // Si falla, debemos tomar el parámetro recibido como un STRING
      // El constructor del DATE considera el String como MM/DD/AAAA, 
      // por lo que se debe adecuar para generar el objeto
      fecha = fecha.substring(3, 5) + "/" + fecha.substring(0, 2) + "/" + fecha.substring(6, 10);
      fechaDate = new Date(fecha);
    }

    let y: string = (fechaDate.getFullYear()).toString();
    let m: string = (fechaDate.getMonth() + 1).toString();
    let d: string = (fechaDate.getDate()).toString();

    if (d.length < 2)
      d = "0" + d;
    if (m.length < 2)
      m = "0" + m;

    return y + "-" + m + "-" + d;
     */
  }
  private getFechaDefault(): string {
    return "1753-01-01";
  }
  /**
     * Para hacer sort considerando los caracteres de edicion.
     * @param propA 
     * @param propB 
     */
  sortDecimal(propA, propB) {
    //console.log('Sorting Comparator', propA, propB);
    const re: RegExp = /\./g;
    const a: Number = Number(propA.replace(re, "").replace(",", "."));
    const b: Number = Number(propB.replace(re, "").replace(",", "."));

    // Just a simple sort function comparisoins
    if (a < b) return -1;
    if (a > b) return 1;
  }
  /**
     * Para hacer sort de fechas considerando los caracteres de edicion.
     * @param propA 
     * @param propB 
     */
  sortFecha(propA, propB) {
    //console.log('Sorting Comparator', propA, propB);
    // Lo siguiente es por un problema con el "this"
    let inArray: any = [propA, propB];
    let outArray: any[] = [];

    for (let itm of inArray) {
      let arr = (<string>itm).split("/");
      let a: string = "";
      if (arr == null || arr.length <= 2) {
        arr = (<string>itm).split("-");
      }
      if (arr != null && arr.length > 2) {
        a = arr[2].toString() + arr[1].toString() + arr[0].toString();
      }
      outArray.push(a);
    }


    // Just a simple sort function comparisoins
    if (outArray[0] < outArray[1]) return -1;
    if (outArray[0] > outArray[1]) return 1;
  }

  /**
   * Define los mensajes de la ngx tabla.
   * @param table 
   */
  setTableMsg(table: any): void {
    table.messages = {
      emptyMessage: 'No hay datos.',
      totalMessage: 'total'
    }
  }

  /**
   * Devuelve cero si el parametro es blanco.
   * @param valor 
   */
  setZero(valor: string): string {
    return valor == "" ? "0" : valor;
  }
  /**
   * Devuelve 1 si el parametro (booleano) es true.
   * @param valor 
   */
  setUno(valor: boolean): string {
    return valor ? "1" : "0";
  }
	/**
   * Inicializa con ceros el campo field.
   * @param field 
   */
  bcxNumeroInit(field: any): void {
    const valor = field.value.trim();

    if (valor == "") {
      field.patchValue("0");
    }
    return;
  }
  /**
   * Pasa a mayusculas el campo field.
   * @param field 
   */
  toUpper(field: any): void {
    const valor = field.value.toUpperCase();
    // Evitemos un loop ....
    if (field.value != valor) {
      field.patchValue(valor);
    }
    return;
  }
  /**
   * Devuelve un rut sin guion y con ceros a a izquierda.
   * BLC, 13/09/2017: Le quitamos el guion.
   * @param valor Valor de Rut
   */
  toRut(valor: string): string {
    let cRutPaso: string = "";
    let cRutFinal: string;

    if (this.esRutVacio(valor))
      cRutFinal = "00000000000";
    else {
      let valorAux: string = valor.replace("-", "").trim();
      for (let i: number = 0; i < (11 - valorAux.length); i++)
        cRutPaso += '0';

      cRutPaso += valorAux;
      cRutFinal = cRutPaso;
    }

    return cRutFinal;
  }
  private esRutVacio(valor: string): boolean {
    return (valor == "-" || valor.length <= 0)

  }
  /**
   * Permite diferenciar entre un click y un cblclick en la tabla.
   * @param event Event
   * @param funcClick Callback para el click
   * @param funcDblClick Callback para el double click
   */
  tableClick(event: any, funcClick: any, funcDblClick: any) {
    if (event.type == 'click') {
      this.tableClicks++;
      if (this.tableClicks == 1) {
        this.tableTimer = setTimeout(() => {
          let hayClick: boolean = this.tableClicks == 1;
          this.tableClicks = 0;
          if (hayClick)
            funcClick(event);
          else
            funcDblClick(event);

        }, 300);
      }
    }
  }

  /**
   * Convierte la entrada Date a DD/MM/YYYY.
   * @param fecha fecha de entrada.
   */
  public toDateUi(fecha: string): string {
    let fechaAux: string = fecha;
    const ptr: number = fecha.indexOf("T");
    if (ptr > 0) {
      fechaAux = fechaAux.substring(0, ptr);
    }
    //const fechaDate: any = new Date(fechaAux);
    let y: string = fechaAux.substring(0, 4);
    let m: string = fechaAux.substring(5, 7);
    let d: string = fechaAux.substring(8, 10);

    if (d.length < 2)
      d = "0" + d;
    if (m.length < 2)
      m = "0" + m;

    let sep: string = "/";
    return d + sep + m + sep + y;
  }
  public toDateUiNative(fecha: string): string {
    let fechaAux: string = fecha;
    const ptr: number = fecha.indexOf("T");
    if (ptr > 0) {
      fechaAux = fechaAux.substring(0, ptr);
    }
    //const fechaDate: any = new Date(fechaAux);
    let y: string = fechaAux.substring(0, 4);
    let m: string = fechaAux.substring(5, 7);
    let d: string = fechaAux.substring(8, 10);
    if (d.length < 2)
      d = "0" + d;
    if (m.length < 2)
      m = "0" + m;

    let sep: string = "-";
    let signo: string = "-";
    // Le agregamos el offset
    let offset: number = (new Date()).getTimezoneOffset() / 60;
    if (offset < 0) {
      offset *= -1;
      signo = "+";
    }
    let offsetAux: string = offset.toString();
    if (offsetAux.length < 2)
      offsetAux = "0" + offsetAux;

    let hhmmOffset: string = "T00:00:00" + signo + offsetAux + ":00";
    return y + sep + m + sep + d + hhmmOffset;
  }
  /**
   * Cambiamos los caracteres con significado XML
   * @param valor 
   */
  public toString(s: string): string {
    let re: RegExp = /&/g;
    let out: string = s.replace(re, "&amp;");
    re = /</g;
    out = out.replace(re, "&lt;");
    re = />/g;
    out = out.replace(re, "&gt;");
    re = /"/g;
    out = out.replace(re, "&quot;");

    return out;
  }
  public hayVal(campo: any, val: string): boolean {
    return campo && campo.toString().toLowerCase().indexOf(val) !== -1;
  }
}