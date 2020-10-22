// Generado por Xml2Ang, Bcx Solutions 
// Fecha: 30/07/2020 18:34:13
import { AfterViewChecked, Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
// import { DateAdapter } from '@angular/material/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { interval } from 'rxjs';
import { HttpClient } from '@angular/common/http';

// Componentes y objetos Bcx
import { CmContextService
       , CmDialogAlertComponent
       , CmWsHostService
       , CmTextoComboValidator
       , CmUtilService
       , CmWaitComponent
			 , CmWsResult } from '@bcxang';
			 
import { FBP_RS_AUTH_SERVER } from '@bcxang/lib/ws/FBP_RS_AUTH_SERVER';

// Rest Services
import { CmRsDeleteService } from './rs/cm-rs-delete.service';
import { CmRsGetService } from './rs/cm-rs-get.service';
import { CmRsPostService } from './rs/cm-rs-post.service';

import { environment } from '../environments/environment';

@Component({
	selector: 'anularCobranza',
	templateUrl: 'anularCobranza.component.html'
})
/**
 * Form: Anular Cobranza al Exterior
 */
export class AnularCobranzaComponent implements OnInit
{
	// Nombre de la pagina.
	pageName: string = 'anularCobranza';
	// Estructura con los datos del form.
	form: FormGroup;
	
	// Objetos de input.
	txtNumeroOperacion :any;
	txtFechaOperacion :any;
	txtSucursalCliente :any;
	cbbSucursalCliente :any;
	txtMoneda :any;
	cbbMoneda :any;
	bcxMontoMoneda :any;
	optOrigen :any;
	txtOrigenFondo :any;
	cbbOrigenFondo :any;
	cbbCuentaFondo :any;
	txtSucursalFondo :any;
	cbbSucursalFondo :any;
	bcxTipoCambio :any;

	//Objetos generales
	varRutCliente: any;

	//Objetos de botones
	cmdDisableComisiones:any;
	cmdDisableCursar:any;

	// Parametros generales
	varCodigoOri: string = "";
	url: string;

	arregloInitial: any[] = [];

	// Activa o desactiva el progress.
	waitShow: boolean;
	// Registro de los WS finalizados.
	wsFin: boolean[] = [];
	// Datos de combo box.
	cbbSucursalClienteArray: any[] = [];
	cbbMonedaArray: any[] = [];
	cbbOrigenFondoArray: any[] = [];
	cbbCuentaFondoArray: any[] = [];
	cbbSucursalFondoArray: any[] = [];

	user: any;

	@ViewChild("txtNumeroOperacion") txtNumeroOperacionDom:ElementRef; 
	@ViewChild("txtOrigenFondo") txtOrigenFondoDom:ElementRef; 

	constructor (private hostService: CmWsHostService
		, private formBuilder: FormBuilder
		, public  dialog: MatDialog
		, private router: Router
		, private http: HttpClient
		, private location: Location
		, public  utilService: CmUtilService
		, private contextService: CmContextService
		, private rsDeleteService: CmRsDeleteService
		, private rsGetService: CmRsGetService
		, private rsPostService: CmRsPostService
		, private fbpRsAuthServer: FBP_RS_AUTH_SERVER
		){
		}

	/**
	 * Inicializamos todo.
	 */
	ngOnInit()
	{
		// Campos del formulario.
		this.formDef();
		this.controlesDef();
		// Numericos y uppercase.
		this.valueChanges();
		// Recuperamos el contexto.
		const ctxSw :boolean = this.contextService.recover(this);
		const queryParams: any = this.utilService.getQueryParams();

		//FIXME:modo de transición 
		this.user = queryParams["setUsuario"] == undefined ? '' : queryParams["setUsuario"];

		if (!ctxSw)
		{
			if (this.user  != '' ) {
				setTimeout(() => {
					this.init();
				}, 1000)
			}
			else {
				this.waitShow = true;
				const subscription = interval(1000)
				.subscribe(() => {
		
					/* <BLOQUE PARA VALIDACION DE TOKEN>*/
					this.fbpRsAuthServer.call(
							(value) => this.fbpRsAuthServerResult(value)
						, (value) => this.openDialogAlert(value)
						,`Bearer ${this.hostService.getToken()}`
					);
					/* </BLOQUE PARA VALIDACION DE TOKEN>*/
		
					subscription.unsubscribe();
				});
			}
		}
		else {
			this.arregloInitial = this.contextService.getUserData("arregloInitial");
		}

		// Validadores de Combo-Texto.
		this.validatorsDef();
	}

	init () {

		this.saveformInitial();
		this.contextService.setUserData("arregloInitial", this.arregloInitial);
		
		// Combos llenados al inicio.
		this.waitShow = true;
		this.wsFin = [];

		// cbbSucursalCliente
		this.wsFin.push(false);
		this.rsPostService.call (
			'BCX_RS_260_TBL_PRM'
			, (value) => this.getComboData(value, 0)
			, (value) => this.processFault(value)
			,	{
					 'nem_tbl': 'SUCURSAL'
					,'fil_prm': ''
					,'wss_usercode': this.hostService.getTokenUser()
				}
		);

		// cbbMoneda
		this.wsFin.push(false);
		this.rsPostService.call (
			'BCX_RS_260_TBL_PRM'
			, (value) => this.getComboData(value, 1)
			, (value) => this.processFault(value)
			,
				{
					 'nem_tbl': 'MONEDA'
					,'fil_prm': ''
					,'wss_usercode': this.hostService.getTokenUser()
				}
		);

		this.cmdLimpiar_click();

	}

	ofunc_leer_operacion():void {
		if (this.txtNumeroOperacion.value != "") {
			this.cexRs251OprCall();
		}
	}

	saveformInitial():void {				
		Object.entries(this.form.controls).forEach( obj =>    
		  this.arregloInitial.push({ name: obj[0], value: obj[1].value})
		);
	}

	/**
   * Recibe una fecha (dd/mm/yyyy) de tipo string. Devuelve yyyy-mm-dd
   * @param string dd/mm/yyyy
	 * @returns string yyyy-mm-dd
   */
  private convetirDateText(fecha: string): string {		
		if (fecha.trim() == "") {
			return "";
		} 
		else {
			let yyyy: string = fecha.substring(6, 10);
			let mm: string = fecha.substring(3, 5);
			let dd: string = fecha.substring(0, 2);
			return yyyy + "-" + mm + "-" + dd;
		}
  }

	/**
	 * Llamamos al Web Service.
	 */
	private cexRs251OprCall(): void
	{
		/* Mover los datos de la pantalla a los parametros del Web Service. */
		let data = {
			'wss_opr_num': this.txtNumeroOperacion.value,
			'wss_usercode': this.hostService.getTokenUser()
		}

		// Activamos el simbolo de progress.
		this.waitShow = true;
		// Invocamos el RS.
		this.rsPostService.call(
			'CEX_RS_251_OPR'
			, (value) => this.cexRs251OprResult(value)
			, (value) => this.processFault(value)
			, data
		);

		// Aca no puede haber nada que dependa del resultado (asincrono).

	}

	/**
	 * Callback invocado por this.cexRs251Opr.call.
	 * @param wsResult Parametros de salida, mensaje de error.
	 */
	cexRs251OprResult(wsResult :CmWsResult): void
	{
		// Desactivamos el simbolo de progress.
		this.waitShow = false;

		// A veces el Fault se viene por aca.
		let hayError: boolean = wsResult.hayError();
		if (hayError)
		{
			let msg: string = wsResult.getErrorMsg();
			let code: string = wsResult.getErrorCode();
			this.utilService.alert(this.dialog, msg + ' [' + code + ']');
		}
		else if (wsResult.getReturnValue() == 0 ) {
			let msg: string = wsResult.getResultString('wss_result_msg');
			this.utilService.alert(this.dialog, msg);
		}
		else {

			this.varRutCliente.patchValue(wsResult.getResultString('wss_cod_cli').trim());
			// this.txtNombreCliente.patchValue(wsResult.getResultString('wss_nom_cli').trim());
			// this.txtDireccionCliente.patchValue(wsResult.getResultString('wss_dir_cli').trim());
			this.txtSucursalCliente.patchValue(wsResult.getResultString('wss_ofi').toString());
			this.txtFechaOperacion.patchValue(this.convetirDateText(wsResult.getResultString('wss_fec_ing').trim()));
			this.txtMoneda.patchValue(wsResult.getResultString('wss_mon_ope').trim());
			// this.bcxMontoMoneda.patchValue(wsResult.getResultNumberFormat('wss_mto_orig', 2));
			this.bcxMontoMoneda.patchValue(wsResult.getResultNumberFormat('wss_mto_sdo', 2));
			this.optOrigen.patchValue(wsResult.getResultString('wss_odf_ind').trim());
			this.cbbCuentaFondo.patchValue(wsResult.getResultString('wss_odf_ccte').trim());
			this.txtOrigenFondo.patchValue(wsResult.getResultString('wss_odf_cyg').toString());
			this.txtSucursalFondo.patchValue(wsResult.getResultString('wss_odf_suc').toString());
			this.bcxTipoCambio.patchValue(wsResult.getResultNumberFormat('wss_odf_tip_cam', 9));
			
			this.ofunc_habilitar_control(true);			
			setTimeout(() => { 				
				this.txtOrigenFondoDom.nativeElement.focus();
			}, 1)
			
		}

	}

	/**
	 * Llamamos al Rest Service.
	 */
	private cexRs200172CexCall(): void
	{
		/* Mover los datos de la pantalla a los parametros del Rest Service. */ 
		const data:any = {
				"wss_cod_acc": "A"
			, "wss_num_opr": this.txtNumeroOperacion.value
			, "wss_tip_cex": ""
			, "wss_suc_ing": "0"
			, "wss_cod_exp": ""
			, "wss_ref_exp": ""
			, "wss_num_fac": ""
			, "wss_nom_grd": ""
			, "wss_dir_grd": ""
			, "wss_ciu_grd": ""
			, "wss_pai_grd": ""
			, "wss_cod_cob": ""
			, "wss_ref_cob": ""
			, "wss_cod_rmb": ""
			, "wss_mon_ope": ""
			, "wss_mto_orig": "0"
			, "wss_gto_bco": "0"
			, "wss_mto_vis": "0"
			, "wss_mto_plz": "0"
			, "wss_int_nor": "0"
			, "wss_tas_nor": "0"
			, "wss_spr_nor": "0"
			, "wss_dsd_nor": this.utilService.toDate("")
			, "wss_has_nor": this.utilService.toDate("")
			, "wss_int_mra": "0"
			, "wss_tas_mra": "0"
			, "wss_spr_mra": "0"
			, "wss_dsd_mra": this.utilService.toDate("")
			, "wss_has_mra": this.utilService.toDate("")
			, "wss_for_pag": "0"
			, "wss_cnd_prt": "0"
			, "wss_ind_ald": "0"
			, "wss_num_ald": ""
			, "wss_vrf_ald": ""
			, "wss_cor_ald": "0"
			, "wss_fec_vto": this.utilService.toDate("")
			, "wss_via_tpt": "0"
			, "wss_pto_orig": ""
			, "wss_pto_dst": ""
			, "wss_opr_cls_vta": "0"
			, "wss_fec_emb": this.utilService.toDate("")
			, "wss_nom_tpt": ""
			, "wss_num_bl": ""
			, "wss_opr_mto_fob": "0"
			, "wss_opr_mto_flt": "0"
			, "wss_opr_mto_seg": "0"
			, "wss_nom_cou": ""
			, "wss_num_gui1": ""
			, "wss_num_gui2": ""
			, "wss_fec_gui1": ""
			, "wss_fec_gui2": ""
			, "wss_cnd_ent": "0"
			, "wss_odf_ind": this.optOrigen.value
			, "wss_odf_cyg": this.txtOrigenFondo.value == "" ? "0" : this.txtOrigenFondo.value
			, "wss_odf_suc": this.txtSucursalFondo.value == "" ? "0" : this.txtSucursalFondo.value
			, "wss_odf_ccte": this.cbbCuentaFondo.value
			, "wss_odf_tip_cam": this.utilService.toDecimal(this.bcxTipoCambio.value)
			, "wss_ref_grd": ""
			, "wss_nom_cob": ""
			, "wss_dir_cob": ""
			, "wss_pai_cob": ""
			, "wss_usercode": this.hostService.getTokenUser()
		};
		 
		// Activamos el simbolo de progress.
		this.waitShow = true;
		// Invocamos el RS.
		this.rsPostService.call(
			'CEX_RS_200_172_CEX'
			, (value) => this.cexRs200172CexResult(value)
			, (value) => this.processFault(value)
			, data
		);
		// Aca no puede haber nada que dependa del resultado (asincrono).
	}

	/**
	 * Callback invocado por this.cexRs200172Cex.call.
	 * @param wsResult Parametros de salida, mensaje de error.
	 */
	cexRs200172CexResult(wsResult :CmWsResult): void
	{
		// Desactivamos el simbolo de progress.
		this.waitShow = false;
		/* Mover los parametros de salida a la pantalla. 
		this.xyz.patchValue(wsResult.getResultString('wss_result_msg'));
		 */
		// A veces el Fault se viene por aca.
		let hayError: boolean = wsResult.hayError();
		if (hayError)
		{
			let msg: string = wsResult.getErrorMsg();
			let code: string = wsResult.getErrorCode();
			this.utilService.alert(this.dialog, msg + ' [' + code + ']');
		}
		else if (wsResult.getReturnValue() == 0 ) {
			let msg: string = wsResult.getResultString('wss_result_msg');
			this.utilService.alert(this.dialog, msg);
		}
		else {
			this.imprimir_doc_revisa();
			this.cmdLimpiar_click();
			this.cmdDisableCursar.patchValue(true);
		}
	}

	/**
	 * Callback invocado por this.fbpRsAuthServer.call.
	 * @param wsResult Parametros de salida, mensaje de error.
	 */
	fbpRsAuthServerResult(wsResult :CmWsResult): void {
		// Desactivamos el simbolo de progress.
		this.waitShow = false;

		// A veces el Fault se viene por acá
		let hayError: boolean = wsResult.hayError();
		
		if(wsResult.getReturnValue() == 1) {
			if(wsResult.getResultString('status') == 'OK'){
				this.init();
			} 
			else{
				this.router.navigate(['cm-error']);
			}
		}
		else{
			this.router.navigate(['cm-error']);
		}
		if (hayError) {
			this.router.navigate(['cm-error']);
		}
	}

	private getComboData = (wsResult: CmWsResult, nro:number): void =>
	{
		const arr:any[] = wsResult.getTableRows();
		switch (nro) {
			case 0:
				this.cbbSucursalClienteArray = arr;
				this.cbbSucursalFondoArray = arr;

				this.txtSucursalCliente.setValidators(CmTextoComboValidator(this.cbbSucursalClienteArray, 'fld_cod_prm'));
				this.txtSucursalFondo.setValidators(CmTextoComboValidator(this.cbbSucursalFondoArray, 'fld_cod_prm'));
				break;
			case 1:
				this.cbbMonedaArray = arr;

				this.txtMoneda.setValidators(CmTextoComboValidator(this.cbbMonedaArray, 'fld_cod_prm'));
				break;
			case 2:
				this.cbbOrigenFondoArray = arr;
				
				this.txtOrigenFondo.setValidators(CmTextoComboValidator(this.cbbOrigenFondoArray, 'COD_DES'));
				break;
			case 3:
				this.cbbCuentaFondoArray = arr;
				
				break;
			default:
				this.utilService.alert(this.dialog, 'Error de Sistema en getComboData!!!');
				return;
		}
		this.getComboDataFin(nro, wsResult);
	}

	/**
	 * Comun para todos los Web Services que se ejecutan al inicio.
	 */
	private getComboDataFin(nro: number, wsResult: CmWsResult): void
	{
		this.wsFin[nro] = true;
		// Preguntamos si todos los Web Services respondieron.
		if (this.wsFin.every(function(x) { return x }))
		{
			this.waitShow = false;
			this.validatorsDef();
		}
		// A veces el Fault se viene por aca.
		let hayError : boolean = wsResult.hayError();
		if (hayError)
		{
			let msg: string = wsResult.getErrorMsg();
			let code: string = wsResult.getErrorCode();
			this.utilService.alert(this.dialog, msg + '[' + code + ']');
		}
	}
	/**
	 * Evento click del boton cmdComisiones.
	 */
	cmdComisiones_click(): void
	{
		this.waitShow = true;
		this.contextService.store(this);
		this.contextService.setUserData("indicadorEvento", "COM");
		let numeroOperacion: string = this.txtNumeroOperacion.value;
		let codigoIndicador: string = "A";
		let codigoProducto: string = "CEX";
		let codigoEvento: string = ""

		this.router.navigate(['/comisiones', 
			numeroOperacion, 
			codigoIndicador, 
			codigoProducto,
			codigoEvento 
		]);
	}
	/**
	 * Evento click del boton cmdLimpiar.
	 */
	cmdLimpiar_click(): void
	{
				
		this.arregloInitial.forEach(key => {
			this.form.controls[key.name].setErrors(null);
			this[key.name].patchValue(key.value)
		})

		this.ofunc_habilitar_control(false);

		setTimeout(() => { 
			this.txtNumeroOperacionDom.nativeElement.focus();
		}, 1)
	}

	/**
	 * Evento click del boton cmdCursar.
	 */
	cmdCursar_click(): void
	{
		this.waitShow = false;
		this.cexRs200172CexCall();
	}

	/**
	 * Documento Revisa PDF.
	 */
	imprimir_doc_revisa() {
		this.waitShow = true;
		let random: number = Math.random() * 10000;
		let wss_cod_apl: string = 'DOCREV';
		let fld_eva_num_ope: string = this.txtNumeroOperacion.value.replace(/^\s*|\s*$/g, '');
		let fld_eva_num_doc_rev: string = '0';
		let fld_eva_est_eve: string = '0';

		this.url = this.hostService.getHost() + "/BCXGENPDF_WEB/generarPDF?"+
				"wss_cod_apl=" + wss_cod_apl + 
				"&fld_eva_num_ope=" + fld_eva_num_ope + 
				"&fld_eva_num_doc_rev=" + fld_eva_num_doc_rev +
				"&fld_eva_est_eve=" + fld_eva_est_eve +
				"&random=" + random;

    if (this.url.indexOf("http:") < 0) {
			this.url = 'http://' +  this.url;
		}

		return this.http.get(this.url, {responseType: 'blob'})			
		.subscribe(blob => {
			const a = document.createElement('a');
			const objectUrl = URL.createObjectURL(blob);
			a.href = objectUrl;
			a.download = "revisa_" + fld_eva_num_ope;
			a.click();
			URL.revokeObjectURL(objectUrl);
			this.waitShow = false;
		})
 
	}

	ofunc_habilitar_control(bFlag:Boolean): void {
		!bFlag == true ? this.txtNumeroOperacion.enable() : this.txtNumeroOperacion.disable();
		bFlag == true ? this.txtSucursalCliente.enable() : this.txtSucursalCliente.disable(); 
		bFlag == true ? this.optOrigen.enable() : this.optOrigen.disable(); 
		bFlag == true ? this.txtOrigenFondo.enable() : this.txtOrigenFondo.disable(); 
		bFlag == true ? this.cbbOrigenFondo.enable() : this.cbbOrigenFondo.disable(); 
		bFlag == true ? this.cbbCuentaFondo.enable() : this.cbbCuentaFondo.disable(); 
		bFlag == true ? this.txtSucursalFondo.enable() : this.txtSucursalFondo.disable(); 
		bFlag == true ? this.cbbSucursalFondo.enable() : this.cbbSucursalFondo.disable(); 
		bFlag == true ? this.bcxTipoCambio.enable() : this.bcxTipoCambio.disable(); 

		this.txtFechaOperacion.disable();
		this.txtSucursalCliente.disable();
		this.cbbSucursalCliente.disable();
		this.txtMoneda.disable();
		this.cbbMoneda.disable();
		this.bcxMontoMoneda.disable();

		//Botones
		this.cmdDisableCursar.patchValue(!bFlag);
		this.cmdDisableComisiones.patchValue(!bFlag);
	}

	/**
   * Habilita o deshabilita combo de cuenta corriente y ejecuta el servicio de cuentas(MN - MX).
   */
  fx_ctacteOpi(name: string){
		let value: string = this[name].value;
		let txtMoneda: string = this.txtMoneda.value;
		let optRadioName: string = "optOrigen"; 
		let cbbCtaName: string = "cbbCuentaFondo";
		let txtRutFormat: string = this.utilService.toRut(this.varRutCliente.value)
		let user: string = this.hostService.getTokenUser()

    if ((value == '5' && this[optRadioName].value == 'X' ) || (value == '1' && this[optRadioName].value == 'N')) {
      this[cbbCtaName].enable();
			this.waitShow = true;

			let data = {
				'wss_cli_cod_cli' : txtRutFormat,
				'wss_cod_mon' : this[optRadioName].value == 'N' ? '0' : txtMoneda,
				'wss_usercode': user
			}

			this.rsGetService.call(
				'BCX_RS_99_200_160_CLI_CTA'
				, (value) => this.getComboData(value, 3)
				, (value) => this.processFault(value)
				, data
			);

    }
    else {
      this[cbbCtaName].disable();	
    }
	}

	/**
	 * Helper para desplegar alertas.
	 */
	private openDialogAlert(msg: string): void
	{
		this.waitShow = false;
		this.utilService.alert(this.dialog, msg);
	}
	
	/**
	 * Callback para el caso de Fault en llamada a Web Service.
	 */
	private processFault(err: any): void
	{
		this.waitShow = false;
		this.utilService.alert(this.dialog, err.error);
	}

	/**
	 * Controles del formulario.
	 */
	private formDef(): void
	{
		this.form = this.formBuilder.group({
			txtNumeroOperacion:'',
			txtFechaOperacion:'',
			txtSucursalCliente:'',
			cbbSucursalCliente:'',
			txtMoneda:'',
			cbbMoneda:'',
			bcxMontoMoneda:'0,00',
			optOrigen:'N',
			txtOrigenFondo:'',
			cbbOrigenFondo:'',
			cbbCuentaFondo:'',
			txtSucursalFondo:'',
			cbbSucursalFondo:'',
			bcxTipoCambio:'0,000000000',

			//General
			varRutCliente:'',

			//Botones
			cmdDisableComisiones:true,
			cmdDisableCursar:true
		});
	}

	/**
	 * Nombres de controles para simplificar su uso.
	 */
	private controlesDef(): void
	{
		this.txtNumeroOperacion = this.form.controls['txtNumeroOperacion'];
		this.txtFechaOperacion = this.form.controls['txtFechaOperacion'];
		this.txtSucursalCliente = this.form.controls['txtSucursalCliente'];
		this.cbbSucursalCliente = this.form.controls['cbbSucursalCliente'];
		this.txtMoneda = this.form.controls['txtMoneda'];
		this.cbbMoneda = this.form.controls['cbbMoneda'];
		this.bcxMontoMoneda = this.form.controls['bcxMontoMoneda'];
		this.optOrigen = this.form.controls['optOrigen'];
		this.txtOrigenFondo = this.form.controls['txtOrigenFondo'];
		this.cbbOrigenFondo = this.form.controls['cbbOrigenFondo'];
		this.cbbCuentaFondo = this.form.controls['cbbCuentaFondo'];
		this.txtSucursalFondo = this.form.controls['txtSucursalFondo'];
		this.cbbSucursalFondo = this.form.controls['cbbSucursalFondo'];
		this.bcxTipoCambio = this.form.controls['bcxTipoCambio'];

		//General
		this.varRutCliente = this.form.controls['varRutCliente'];
		
		//Botones
		this.cmdDisableComisiones = this.form.controls['cmdDisableComisiones'];
		this.cmdDisableCursar = this.form.controls['cmdDisableCursar'];
	}

	/**
	 * Validadores de texto - combo.
	 */
	private validatorsDef(): void
	{
		// this.txtSucursalCliente.setValidators(CmTextoComboValidator(this.cbbSucursalClienteArray, 'fld_cod_prm'));
		// this.txtMoneda.setValidators(CmTextoComboValidator(this.cbbMonedaArray, 'fld_cod_prm'));
		// this.txtOrigenFondo.setValidators(CmTextoComboValidator(this.cbbOrigenFondoArray, 'COD_DES'));
		// this.txtSucursalFondo.setValidators(CmTextoComboValidator(this.cbbSucursalFondoArray, 'fld_cod_prm'));
	}

	/**
	 * Inscribe metodos para atrapar los cambios a los campos del formulario.
	 * Adecuado para uppercase,  valor inicial de BcxNumero,
	 * mantener relacion texto - combo, filtro de tabla.
	 */
	private valueChanges(): void
	{

		// ORIGEN DE FONDO
		this.optOrigen.valueChanges.subscribe((value: string) => {
			if (this.varCodigoOri != value ) {
				this.varCodigoOri = value;

				// cbbOrigenFondo
				this.wsFin.push(false);
				this.rsPostService.call (
					'BCX_RS_99_260_ODF'
					, (value) => this.getComboData(value, 2)
					, (value) => this.processFault(value)
					,	{
							 'wss_tip_odf': value == 'X' ? '1' : '2'
							,'wss_usercode': this.hostService.getTokenUser()
						}
				);
			}
		})
			
		this.txtSucursalCliente.valueChanges.subscribe((value) => {
			this.utilService.comboTexto_changeSelect(this.cbbSucursalCliente, value);
		});
		this.cbbSucursalCliente.valueChanges.subscribe((value) => {
			this.utilService.textoCombo_change(this.txtSucursalCliente, value);
		});
		this.txtMoneda.valueChanges.subscribe((value) => {
			this.utilService.comboTexto_changeSelect(this.cbbMoneda, value);
		});
		this.cbbMoneda.valueChanges.subscribe((value) => {
			this.utilService.textoCombo_change(this.txtMoneda, value);
		});
		// this.bcxMontoMoneda.valueChanges.subscribe((value) => {
		// 	this.utilService.bcxNumeroInit(this.bcxMontoMoneda);
		// });
		this.txtOrigenFondo.valueChanges.subscribe((value) => {
			this.utilService.comboTexto_changeSelect(this.cbbOrigenFondo, value);
		});
		this.cbbOrigenFondo.valueChanges.subscribe((value) => {
			this.utilService.textoCombo_change(this.txtOrigenFondo, value);
		});
		this.txtSucursalFondo.valueChanges.subscribe((value) => {
			this.utilService.comboTexto_changeSelect(this.cbbSucursalFondo, value);
		});
		this.cbbSucursalFondo.valueChanges.subscribe((value) => {
			this.utilService.textoCombo_change(this.txtSucursalFondo, value);
		});
	}
}
