/**
 * Resultado de la llamada a Web Service
 */
export class CmWsResult {
  private tableRows: any[] = [];
  private error: boolean = false;
  private errorMsg:string = "";
  private errorCode: string = "";
  private output: any = {};
  private returnValue: number;
  constructor() {
   // this.tableRows = new Array();
  }

  setTableRows(datatable: any[]) :void {
    this.tableRows = datatable;
  }
  getTableRows() : any {
    return this.tableRows;
  }
  setError(err: boolean) :void {
    this.error = err;
  }
  hayError() : boolean {
    return this.error || (this.errorMsg != null && this.errorMsg.length > 0);
  }
  setErrorMsg(msg :string) :void {
    this.errorMsg = msg;
  }
  getErrorMsg() :string {
    return this.errorMsg;
  }
  setErrorCode(code: string) :void {
    this.errorCode = code;
  }
  getErrorCode() :string {
    return this.errorCode;
  }
  setOutput(obj: any) :void {
    this.output = obj;
  }
  getOutput() : any {
    return this.output;
  }
  setReturnValue(cod: number): void
  {
    this.returnValue = cod;
  }
  getReturnValue() :number 
  {
    return this.returnValue;
  }
  /**
   * Formatea una variable de output como Date.
   * Asume el TimeZone del PC.
   * @param name Nombre del output a formatear.
   */
  getResultDate(name :any) : any
  {
    // BLC
    let aux :string = this.toDateStd(this.output[name]);
    //let fecha: any = new Date(aux);
    // BLC
    return aux;
 
  }
  /**
   * Formatea una variable de output como String dd/mm/aaaa.
   * @param name Nombre del output a formatear.
   */
  getResultDateUI(name :any) : any
  {
    let aux :string = this.toDateUi(this.output[name]);
    return aux;
  }


  getResultString(name) : string
  {
    
     return this.output[name];
    
  }
  /**
   * Formatea una variable de output como decimal.
   * @param name Nombre del output a formatear.
   */
  getResultNumberFormat(name :any, dec:number = 2) : string
  {
    let aux = Number(this.output[name]);
    if (isNaN(aux))
        aux = 0;
     return aux.toLocaleString(["de-DE"], { minimumFractionDigits: dec });
  
  }
  /**
   * Formatea una columna de tipo date.
   * @param name Nombre de la columna 'date' a formatear.
   */
  formatDateAdd(name :string) : void
  {
    let nameFormat: string = name + "_format";
     for (let row of this.tableRows) {
        row[nameFormat] = this.toDateUi(row[name]);
     }
  }
  /**
   * Formatea una columna decimal.
   * @param name Nombre de la columna decimal a formatear
   * @param dec Nro de decimales.
   */
  formatDecAdd(name :string, dec:number = 2) : void
  {
    let nameFormat: string = name + "_format";
     for (let row of this.tableRows) {
            let aux = Number(row[name]);
            if (isNaN(aux))
                aux = 0;
            row[nameFormat] =  aux.toLocaleString("de-DE", { minimumFractionDigits: dec });
      }
  }
  /**
   * Convierte la entrada Date a YYYY-MM-DD.
   * @param fecha fecha de entrada. En formato yyyy-mm-ddTxxx
   */
  private toDateStd(fecha: string) :string
  {
    if (fecha == null)
      return null;
    let fechaAux :string = fecha;
   // const ptr: number = fecha.indexOf("T");
   // if (ptr > 0)
   // {
   //   fechaAux = fechaAux.substring(0, ptr);
   // }
    //const fechaDate: any = new Date(fechaAux);
    let y: string = fechaAux.substring(0, 4);
    let m: string = fechaAux.substring(5, 7);
    let d: string = fechaAux.substring(8, 10);

    if (d.length < 2)
      d = "0" + d;
    if (m.length < 2)
      m = "0" + m;

    const sep: string = "-";
    return  y + sep + m + sep + d ;
  }
  /**
   * Convierte la entrada Date a DD/MM/YYYY.
   * @param fecha fecha de entrada.
   */
  private toDateUi(fecha: string) :string
  {
    let fechaAux :string = fecha;
    const ptr: number = fecha.toString().indexOf("T");
    if (ptr > 0)
    {
      fechaAux = fechaAux.substring(0, ptr);
    }
    //const fechaDate: any = new Date(fechaAux);
    let y: string = fechaAux.toString().substring(0, 4);
    let m: string = fechaAux.toString().substring(5, 7);
    let d: string = fechaAux.toString().substring(8, 10);

    if (d.length < 2)
      d = "0" + d;
    if (m.length < 2)
      m = "0" + m;

    let sep: string = "/";
    return d + sep + m + sep + y;
  }
  private toDateUiNative(fecha: string) :string
  {
    let fechaAux :string = fecha;
    const ptr: number = fecha.indexOf("T");
    if (ptr > 0)
    {
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
    let signo :string = "-";
    // Le agregamos el offset
    let offset: number = (new Date()).getTimezoneOffset() / 60;
    if (offset < 0 )
    {
      offset *= -1;
      signo = "+";
    }
    let offsetAux: string = offset.toString();
    if (offsetAux.length < 2)
      offsetAux = "0" + offsetAux;

    let hhmmOffset: string = "T00:00:00" + signo + offsetAux + ":00";
    return y + sep + m + sep + d + hhmmOffset ;
  }
}