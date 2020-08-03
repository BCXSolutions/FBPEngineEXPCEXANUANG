import { Injectable } from '@angular/core';
//import { Http, Response, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
//import 'rxjs/add/operator/map';
import { map, catchError } from 'rxjs/operators';
//import 'rxjs/add/operator/catch';
import * as parse from "xml-parser";

//import { CmWsParam } from './cm-ws-param';
import { CmWsResult } from './cm-ws-result';
import { CmWindowRefService } from './cm-window-ref.service';
import { JwtHelperService } from '@auth0/angular-jwt';

/**
 * Obtencion de datos de Web Service SOAP.
 * BLC, 5/12/2019: Devolvemos un objeto en handleErrorRest
 * BLC, 10/01/2020: getRestEx, deleteRest
 * BLC, 11/03/2020: resultRest
 * 
 */
@Injectable()
export class CmWsHostService {


  private ruta: string = "";
  private rutaIni: string = "";
  public WS_STANDARD: number = 0;
  public WS_LEGACY: number = 1;
  private configStrXml: string;
  private servidor: string = "";
  private puerto: string = "";
  private soapUser: string = "";
  private soapPasswd: string = "";
  private soapVersion: string = "";
  private host: string = "";
  private token: string = "";


  constructor(private http: HttpClient
    , private windowRefService: CmWindowRefService) { }
  postSoapLegacy(url: string
    , inputTag: string
    , schema: string
    , ...params: any[]): Observable<CmWsResult> {
    return this.postSoapEx(this.WS_LEGACY, url, inputTag, schema, params)
  }
  postSoap(url: string
    , inputTag: string
    , schema: string
    , ...params: any[]): Observable<CmWsResult> {
    return this.postSoapEx(this.WS_STANDARD, url, inputTag, schema, params)
  }

  postSoapEx(legacy: number
    , url: string
    , inputTag: string
    , schema: string
    , params: any[]): Observable<CmWsResult> {

    const soapSchema: string = "http://schemas.xmlsoap.org/soap/envelope/";
    let aux: string = "";
    let parval: string;

    params.forEach(e => {
      if (Array.isArray(e.value)) {
        // Caso legacy: un arreglo con los parametros
        parval = "";
        e.value.forEach(a => { parval += this.xmlTag("string", a) });
      } else {
        parval = e.value;
      }
      aux += this.xmlTag(e.name, parval);

    });
    // Header del SOAP para todos los casos standard
    let soapHeader: string = "";
    // if (legacy == this.WS_STANDARD)
    // {
    const soapNameSpace: string = "http://bcx.cl/xsd";
    const soapHeaderTag: string = 'soap:Header';
    const userTag: string = "t:user";
    const pwdTag: string = "t:passwd";
    const versionTag: string = "t:version";
    const headerSecurityTag = "t:HeaderSecurity";
    const sNameSpace = " xmlns:t='" + soapNameSpace + "'";

    soapHeader = "<" + soapHeaderTag + ">"
      + "<" + headerSecurityTag + sNameSpace + ">"
      + "<" + userTag + ">"
      + this.getSoapUser() + "</" + userTag + ">"
      + "<" + pwdTag + ">"
      + this.getSoapPasswd() + "</" + pwdTag + ">"
      + "<" + versionTag + ">"
      + this.getSoapVersion() + "</" + versionTag + ">"
      + "</" + headerSecurityTag + ">"
      + "</" + soapHeaderTag + ">";
    // }    

    const body: string = '<soap:Envelope xmlns:soap="' + soapSchema
      + '" xmlns:web="' + schema + '">'
      + soapHeader
      + '<soap:Body>'
      + this.xmlTag('web:' + inputTag, aux)
      + '</soap:Body>'
      + '</soap:Envelope>';

    const headers = new HttpHeaders({ 'Content-Type': 'text/xml;charset=UTF-8' });

    if (legacy == this.WS_STANDARD)
      return this.http.post(url, body, { headers: headers, responseType: "text" })
        .pipe(map(this.extractResult), catchError((value) => this.handleErrorPost(value, url)));
    else
      return this.http.post(url, body, { headers: headers, responseType: "text" })
        .pipe(map(this.extractResultLegacy), catchError((value) => this.handleErrorPost(value, url)));
  }

  /**
     * Carga las definiciones iniciales desde el host
     */
  defLoad(file: string): Observable<string> {

    let path: string = "xml/" + file + "?dummy=" + this.getNumber();

    return this.http.get(path, { responseType: "text" })
      .pipe(map(this.extractData), catchError((value) => this.handleErrorGet(value)));
    // Aca no puede haber nada que dependa del llamado a host                    

  }
  private getNumber(): number {
    const minNumber: number = 0; // The minimum number you want
    const maxNumber: number = 1000; // The maximum number you want
    return Math.floor(Math.random() * (maxNumber + 1) + minNumber);
  }
  // Formato de flecha gorda: necesario si se quiere usar  el "this".
  private extractResultLegacy: (res: string) => CmWsResult =
    res => this.resultSoapLegacy(res);
  // Formato de flecha gorda: necesario si se quiere usar  el "this".
  private extractResult: (res: string) => CmWsResult =
    res => this.resultSoap(res);

  private extractData: (res: string) => string =
    res => res;

  private handleErrorGet(error: any) {

    return this.handleError(error, "Archivo xml de configuracion.");
  }
  private handleErrorPost(error: any, url: string) {

    return this.handleError(error, "Web Service: " + url);
  }

  private handleErrorRest(err: any, url: string) {
    let msg: string = err.error;
    if (typeof msg === "string") {
      let p: number = msg.indexOf(" ");
      if (p > 1) {
        err.error = msg.substring(p);
        err.origin = msg.substr(0, p - 1);
      }
    } else {
      err.error = err.message;
    }
    return throwError(err);
    //return this.handleErrorEx(error, "Web Service: " + url, true);
  }

  /**
   * Para SOAP 
   * @param httpError 
   * @param source 
   */
  private handleError(httpError: any, source: string) {


    return this.handleErrorEx(httpError, source, false);
  }
  /**
   * Para SOAP y REST
   * @param httpError 
   * @param source 
   */
  private handleErrorEx(httpError: any, source: string, rest: boolean) {
    // Es un handler, por lo que no se ven las variables de la clase (this.xxx)
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg: string = (httpError.message) ? httpError.message :
      httpError.status ? `${httpError.status} - ${httpError.statusText}` : 'Server error';
    // Lo siguiente viene con datos para REST

    let detailMsg: string = '';
    if (rest)
      detailMsg = httpError.error ? `${httpError.error} - ` : '';

    errMsg = "CmWsHostService: " + detailMsg + errMsg + " - " + source;

    return throwError(errMsg);
  }
  private xmlTag(tag: string, value: string): string {
    return "<" + tag + ">" + value + "</" + tag + ">";
  }
  /**
   * Llena la grilla a partir del XML.
   * @param strXml XML en formato string.
   */
  gridFromSoap(strXml: string): any[] {
    if (this.esFault(strXml)) {
      return [];
    }
    let tableData: any[] = [];

    // Parseamos XML
    const doc: parse.Document = parse(strXml);
    const result: parse.Node = doc.root.children[0].children[0].children[0];
    const rowTag: string = "rows";
    const maxLen: number = result.children.length;
    for (let aux of result.children) {
      let nombre: string = aux.name;
      if (nombre == rowTag) {
        for (let row of aux.children) {
          let maxCol: number = row.children.length;
          let rowObj: any = {};
          for (let col of row.children) {
            //rowObj[col.name] = this.replaceEntity(col.content);
            rowObj[col.name] = col.content;
          }
          tableData.push(rowObj);
        }
      }
    }

    return tableData;
/** Ejemplo del objeto que debemos formar
   let objJson1 = [{"wssCode":"COD_ACT","wssParentAppl":"","wssParentTbl":"","wssSynCode":"","wssSynType":"","wssTblDescrip":"Actividades Economicas","wssTblName":"ACTECO","wssText":"GLS_ACT"},
    {"wssCode":"COD_OPEACT","wssParentAppl":"","wssParentTbl":"","wssSynCode":"","wssSynType":"","wssTblDescrip":"Tipo operacion activa","wssTblName":"ACTTYP","wssText":"GLS_OPEACT"},
    ]
    ;
 */       }
  /**
   * Llena la grilla a partir del XML legacy.
   * @param strXml XML en formato string.
   */
  gridFromSoapLegacy(strXml: string): any[] {
    if (this.esFault(strXml)) {
      return [];
    }

    const str: string = this.extractCdataLegacy(strXml);
    let tableData: any[] = [];

    // Parseamos XML
    const doc: parse.Document = parse(str);
    let result: parse.Node = doc.root;
    const rowTag: string = "Row";
    const rowTagParam: string = this.getConfig("preferences/rowtaglegacy");

    try {
      if (doc.root.children[0].name == rowTag || doc.root.children[0].name == rowTagParam) {
        result = doc.root;
      } else if (doc.root.children[0].children[0].name == rowTag || doc.root.children[0].children[0].name == rowTagParam) {
        result = doc.root.children[0];
      }
    } catch (error) {
      return tableData
    }

    const maxLen: number = result.children.length;

    for (let i = 0; i < maxLen; i++) {
      let row = result.children[i];
      let nombre: string = row.name;
      if (nombre == rowTag || nombre == rowTagParam) {
        let maxCol: number = row.children.length;
        let rowObj: any = {};
        for (let j = 0; j < maxCol; j++) {
          let col = row.children[j];
          //rowObj[col.name] = this.replaceEntity(col.content);
          try {
            rowObj[col.name] = col.content.replace(/^\s*|\s*$/g, '');
          } catch (error) {
            rowObj[col.name] = "";
          }
        }
        tableData.push(rowObj);
      }
    }
    return tableData;
  }

  outputFromSoapLegacy(strXml: string): any {
    if (this.esFault(strXml)) {
      return {};
    }

    let str = this.extractCdataLegacy(strXml);

    let outData: any = {};
    // Parseamos XML
    const doc: parse.Document = parse(str);
    // <xmlRegistro>
    const result: parse.Node = doc.root;
    const rowTag: string = "itemout";

    const itemout = doc.root.children[0];
    if (itemout.name != rowTag)
      return {};
    for (let aux of itemout.children) {
      if (aux.content !== undefined)
        outData[aux.name] = this.replaceEntity(aux.content);
    }
    /** Ejemplo de lo que hay que devolver  
          outData = {fld_plc_tip_mon: "E", fld_plc_glo_pda_ctble: "Creditos para Exportacion", fld_plc_glo_pzo:  'MENOS DE 1 AÑO'
            , fld_plc_cls_cre: 'X', fld_plc_glo_tip_prod: 'NEGOCIACION EXPORTACION', fld_plc_tip_ope_ctpr: '980', fld_plc_tip_int: 'C'
            , fld_plc_ind_ren: 'R', fld_plc_nom_tip_ope: 'MIG. CC EXP PLAZO NEG O PAIS'  };
     
     **/
    return outData;
  }
  outputFromSoap(strXml: string): any {
    if (this.esFault(strXml)) {
      return {};
    }

    let outData: any = {};
    // Parseamos XML
    const doc: parse.Document = parse(strXml);
    const rowTag: string = "itemout";

    const body = doc.root.children[0];
    const result = body.children[0].children[0];
    for (let aux of result.children) {
      if (aux.name == rowTag) {
        for (let item of aux.children) {
          let content: string = item.content !== undefined ? item.content : "";
          outData[item.name] = this.replaceEntity(content);
        }
      }
    }
    /** Ejemplo de lo que hay que devolver  
          outData = {fld_plc_tip_mon: "E", fld_plc_glo_pda_ctble: "Creditos para Exportacion", fld_plc_glo_pzo:  'MENOS DE 1 AÑO'
            , fld_plc_cls_cre: 'X', fld_plc_glo_tip_prod: 'NEGOCIACION EXPORTACION', fld_plc_tip_ope_ctpr: '980', fld_plc_tip_int: 'C'
            , fld_plc_ind_ren: 'R', fld_plc_nom_tip_ope: 'MIG. CC EXP PLAZO NEG O PAIS'  };
     
     **/
    return outData;
  }
  /**
   * Obtiene el returnValue para los no legacy.
   * @param strXml String con el resultado
   */
  returnValueFromSoap(strXml: string): number {
    let returnValue: number = 0;
    if (this.esFault(strXml)) {
      return returnValue;
    }

    // Parseamos XML
    const doc: parse.Document = parse(strXml);
    const rowTag: string = "returnValue";

    const body = doc.root.children[0];
    const result = body.children[0].children[0];
    for (let aux of result.children) {
      if (aux.name == rowTag) {
        returnValue = (aux.content !== undefined ? (Number)(aux.content) : 0);
        break;
      }
    }
    return returnValue;
  }



  private esFault(str: string): boolean {
    return (str.indexOf("<soap:Fault>") > 0
      || str.indexOf("<S:Fault") > 0
      || str.indexOf("<soapenv:Fault") > 0);
  }
  private msgCodeFromSoapLegacy(strXml: string): CmWsResult {

    // Parseamos XML
    const doc: parse.Document = parse(strXml);

    let rowTag: string;
    const wsResult: CmWsResult = new CmWsResult();

    for (let i: number = 0;
      i < doc.root.children[0].children[0].children.length; i++) {
      let nodeAux = doc.root.children[0].children[0].children[i];
      if (nodeAux.name == "detail") {
        let global = nodeAux.children[0];
        for (let j = 0; j < global.children.length; j++) {
          let name = global.children[j].name;
          let msgaux: string | undefined = global.children[j].content;
          let msg: string = msgaux !== undefined ? msgaux : "";
          if (name == "message") {
            wsResult.setErrorMsg(msg);
          } else if (name == "code") {
            wsResult.setErrorCode(msg);

          }
        }
      }
    }


    return wsResult;
  }
  private msgCodeFromSoap(strXml: string): CmWsResult {

    // Parseamos XML
    const doc: parse.Document = parse(strXml);

    let rowTag: string;
    const wsResult: CmWsResult = new CmWsResult();
    let node: any = doc.root.children[0].children[0].children;
    for (let i: number = 0;
      i < node.length; i++) {
      let nodeAux = node[i];
      if (nodeAux.name == "faultcode") {
        wsResult.setErrorCode(nodeAux.content);
      } else if (nodeAux.name == "faultstring") {
        wsResult.setErrorMsg(nodeAux.content);
      }
    }
    return wsResult;
  }

	/**
	 * Extrae lo que esta dentro de CDATA.
	 * @param s xml completo de entrada
	 * return Lo que esta dentro de CDATA. null si no existe
	 */
  extractCdataLegacy(s: string): string {

    let str: string;
    // Buscamos CDATA .
    const cdata: string = "<![CDATA[";
    let index: number = s.indexOf(cdata);

    if (index < 0) {

      const out: string = "<ns1:out>";
      const outEnd: string = "</ns1:out>";
      const outParam: string = "<" + this.getConfig("preferences/resultlegacyws") + ">";
      const outEndParam: string = "</" + this.getConfig("preferences/resultlegacyws") + ">";

      index = s.indexOf(out);
      let index1: number = s.indexOf(outEnd);

      // si no esta, buscamos el parametro en configuration.xml	
      if (index < 0 && index1 < 0) {
        index = s.indexOf(outParam);
        index1 = s.indexOf(outEndParam);
        str = s.substring(index + outParam.length, index1);
      } else {
        str = s.substring(index + out.length, index1);
      }

      // Cambiamos aquellos que son hola>, pero no cambiamos hola >

      let re: RegExp = /([A-Za-z0-9]+[/]?)(&gt;)/g;
      let match = re.exec(str);
      str = str.replace(re, "$1" + ">");
      //re = /&lt;/g;

      str = str.split('?').join('');
      str = str.split('&#xD;').join('');
      str = str.split('&#xd;').join('');
      str = str.split('\&gt;').join('>');
      str = str.split('\&lt;').join('<');

      re = /(&lt;)([/]?[A-Za-z]+)/g;
      str = str.replace(re, "<" + "$2");

      str = str.replace("<![CDATA[", "").replace("]]>", "");

      return str;

    }
    str = s.substr(index + cdata.length);

    // Buscamos el fin de CDATA
    const cdataEnd: string = "]]>";
    index = str.indexOf(cdataEnd);

    if (index <= 0)
      return "";

    str = str.substr(0, index);


    return str;

  }
  resultSoapLegacy(str: string): CmWsResult {
    let res: CmWsResult = new CmWsResult();

    res.setTableRows(this.gridFromSoapLegacy(str));
    res.setOutput(this.outputFromSoapLegacy(str));
    res.setError(this.esFault(str));
    let err: CmWsResult = this.msgCodeFromSoapLegacy(str);

    res.setErrorCode(err.getErrorCode());
    res.setErrorMsg(err.getErrorMsg());

    return res;

  }
  resultSoap(str: string): CmWsResult {
    let res: CmWsResult = new CmWsResult();
    res.setTableRows(this.gridFromSoap(str));
    res.setOutput(this.outputFromSoap(str));
    res.setReturnValue(this.returnValueFromSoap(str));
    res.setError(this.esFault(str));


    let err: CmWsResult = this.msgCodeFromSoap(str);
    res.setErrorCode(err.getErrorCode());
    res.setErrorMsg(err.getErrorMsg());

    return res;

  }
  private replaceEntity(s: string): string {

    // A veces viene algo como &lt;tag&gt;texto &gt; texto2 &lt;/tag&gt;
    // Es decir, < y > escapados pero que no son parte de un tag
    // POR AHORA, si < viene con un espacio al final, asumiremos que no es un tag
    // Idem para  > con espacio al principio

    let re: RegExp = /&gt;/g;
    let str: string = s.replace(re, ">");
    re = /&lt;/g;
    str = str.replace(re, "<");

    return str;
  }
  setRuta(ruta: string): void {
    if (this.rutaIni.length <= 0)
      this.rutaIni = ruta;

    this.ruta = ruta;
  }
  /**
   * Devuelve la ruta del Web Service.
   */
  getRuta(): string {
    return this.makeUrl(this.ruta);
  }
  resetRuta(): void {

    this.ruta = this.rutaIni;
  }
  /**
 * Dado el obejeto de configuracion, encuentra el contenido
 * apuntado por path.
 * @param strXml 
 * @param path 
 * @return El contenido. O null si hubo un problema.
 */
  getConfig(path: string): string {

    const doc: parse.Document = parse(this.configStrXml);

    // Armamos un arrglo con el path
    // Si el primer caracter es un leading "/", lo eliminamos
    path = path.trim();
    if (path.indexOf('/') == 0) {
      path = path.substring(1);
    }

    let array: any[] = path.split('/');
    let node: parse.Node = doc.root;
    let content: string = "";
    const max: number = array.length;
    // El primero tiene tratamiento especial
    //   if (node.name != array[0])
    //     return null;

    for (let i: number = 0; i < max; i++) {
      let name: string = array[i];
      // Lo buscamos en los del mismo nivel
      let nodes = node.children;
      for (let j = 0; j < nodes.length; j++) {
        node = nodes[j];
        if (node.name == name) {
          if (i >= max - 1) {
            // Al final devolvemos el contexto
            if (node.content !== undefined)
              content = node.content;
            else
              content = "";
          }
          break;
        }
      }
      if (node == null || content != "") {
        break;
      }
    }
    return content;
  }
  setConfig(str: string): void {
    this.configStrXml = str;

  }
  setServidor(servidor: string) {
    this.servidor = servidor;
  }
  getServidor(): string {
    return this.servidor;
  }
  setPuerto(puerto: string) {
    this.puerto = puerto;
  }

  getPuerto(): string {
    return this.puerto;
  }
  goInicio(): void {
    const inicioUrl: string = this.getConfig("preferences/inicio-url");
    const url: string = this.makeUrl(inicioUrl);

    this.windowRefService.nativeWindow.location.href = url;

  }
  private getSoapUser(): string {
    return this.soapUser;
  }
  public setSoapUser(user: string): void {
    this.soapUser = user;
  }
  private getSoapPasswd(): string {
    return this.soapPasswd;
  }
  public setSoapPasswd(passwd: string): void {
    this.soapPasswd = passwd;
  }
  private getSoapVersion(): string {
    return this.soapVersion;
  }
  public setSoapVersion(version: string): void {
    this.soapVersion = version;
  }
  public setHost(host: string): void {
    this.host = host;
  }
  public getHost(): string {
    return this.host;
  }
  private makeUrl(url: string) {
    const http: string = "http://";
    let host: string = this.getHost();

    if (host.substr(host.length - 1) != "/")
      host += "/";
    // A veces el browser le quita el http://  del location
    if (host.substr(0, http.length) != http)
      host = http + host;

    let s: string;
    s = url.substr(0, http.length) != http ? host + url : url;

    return s;
  }
  getLoginUrl(): string {
    const url: string = this.getConfig("preferences/login-url");

    return this.makeUrl(url);
  }
  getRest(url: string
    , param: any): Observable<CmWsResult> {

    return this.getRestEx(url, param, true);
  }
  deleteRest(url: string
    , param: any): Observable<CmWsResult> {

    return this.getRestEx(url, param, false);
  }

  private getRestEx(url: string
    , param: any, isGet: boolean): Observable<CmWsResult> {
    //Agregar parametros

    let idToken: string = this.getToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
      , "Authorization": "Bearer " + idToken
    });
    let params = new HttpParams();
    Object.keys(param).forEach(function (key) {
      params = params.append(key, param[key]);
    });
    if (isGet)
      return this.http.get(url, { headers: headers, params: params, responseType: "json" })
        .pipe(map(this.extractResultRest), catchError((value) => this.handleErrorRest(value, url)));
    else
      return this.http.delete(url, { headers: headers, params: params, responseType: "json" })
        .pipe(map(this.extractResultRest), catchError((value) => this.handleErrorRest(value, url)));

  }

  postRest(url: string
    , param: any): Observable<CmWsResult> {

    //Agregar parametros
    const body: any = param == null ? '' : param;
    let idToken: string = this.getToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
      , "Authorization": "Bearer " + idToken
    });

    return this.http.post(url, body, { headers: headers, responseType: "json" })
      .pipe(map(this.extractResultRest), catchError((value) => this.handleErrorRest(value, url)));

  }
  // Formato de flecha gorda: necesario si se quiere usar  el "this".
  extractResultRest: (res: any) => CmWsResult =
    res => this.resultRest(res);


    /**
     * 
     * @param res Para Spring, el error viene por aca
     */
  resultRest(res: any): CmWsResult {
    console.log(res)
    let result: CmWsResult = new CmWsResult();
    if (res.faultInfo)
    {
      //this.handleErrorSpring(res);
      result.setError(true);
      result.setErrorMsg(res.faultInfo);
      result.setReturnValue(0);
      return result;
    }
  
    result.setTableRows(this.gridFromRest(res));
    result.setOutput(res.itemout);
    result.setReturnValue(res.returnValue);
    result.setError(false);


    //let err: CmWsResult = this.msgCodeFromSoap(res);
    //result.setErrorCode(err.getErrorCode());
    //result.setErrorMsg(err.getErrorMsg());

    return result;

  }

  /**
 * Llena la grilla a partir del resultado.
 * @param strRest Resultado Rest en formato string.
 */
  private gridFromRest(strRest: any): any[] {
    if (this.esFaultRest(strRest)) {
      return [];
    }
    let tableData: any[] = strRest.rows;

    return tableData;
/** Ejemplo del objeto que debemos formar
   let tableData = [{"wssCode":"COD_ACT","wssParentAppl":"","wssParentTbl":"","wssSynCode":"","wssSynType":"","wssTblDescrip":"Actividades Economicas","wssTblName":"ACTECO","wssText":"GLS_ACT"},
    {"wssCode":"COD_OPEACT","wssParentAppl":"","wssParentTbl":"","wssSynCode":"","wssSynType":"","wssTblDescrip":"Tipo operacion activa","wssTblName":"ACTTYP","wssText":"GLS_OPEACT"},
    ]
    ;
 */       }
  esFaultRest(strRest: string): boolean {
    return false;
  }
  public setToken(token: string) {
    this.token = token;
  }
  public getToken(): string {
    return this.token;
  }
  public isValidToken(): boolean {
    try {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(this.getToken());
      return true;
    } catch (error) {
      return false;
    }
  }
  public getTokenUser(): string {
    try {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(this.getToken());
      return decodedToken.sub;
    } catch (error) {
      return null;
    }
  }

}
