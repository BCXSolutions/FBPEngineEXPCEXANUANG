// Generado por Xml2Ang, Bcx Solutions 
// Fecha: 17/12/2019 17:59:57
import { AfterViewChecked, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';

// Componentes y objetos Bcx
import { CmContextService
       , CmWsHostService
       , CmTextoComboValidator
       , CmUtilService
       , CmWsResult } from '@bcxang';

// Web Services
import { BCX_RS_260_TBL_PRM } from './services/BCX_RS_260_TBL_PRM.service';
import { BCX_RS_200_160_BANK } from './services/BCX_RS_200_160_BANK.service';


/**
 * Form: Consulta de Bancos
 */
@Component({
	selector: 'consulta-banco',
	templateUrl: 'consulta-banco.component.html'
})
export class ConsultaBancoComponent implements OnInit, AfterViewChecked
{
	// Nombre de la pagina.
	pageName: string = 'ConsultaDeBancos';
	// Estructura con los datos del form.
	form: FormGroup;
	
	// Objetos de input.
	txtCodigoBIC :any;
	txtPais :any;
	cbbPais :any;
	txtPlaza :any;
	cbbPlaza :any;
	optCodigoGrl1:any;
	optCodigoGrl2:any;
	optCodigoGrl3:any;

	codigoBic: any = "";
	// codigoPlaza: any = "";
	// codigoPais:any = "";
	check2:any;
	check3:any;

	cmdPlaza:any;
	codigoPlaza:any;

	varPreingreso:any;
	indicadorEstado:any;
	controlName: any;
	
	// Activa o desactiva el progress.
	waitShow: boolean;
	// Registro de los WS finalizados.
	wsFin: boolean[] = [];
	// Datos de combo box.
	cbbPaisArray: any[] = [];
	cbbPlazaArray: any[] = [];
	// Datos de la tabla.
	tableRows: any[] = [];
	tableCols: any[] = [];
	// Datos para el filtro de la tabla.
	tableRowsTemp: any[] = [];
	// Filas seleccionadas.
	tableSelected: any[] = [];
	// Sort vigente.
	tableSort: any = {};
	// Posicion del scroll vertical.
	tableScroll: number;
	// Indicador.
	tableAfterView: boolean;
	disableBtnAceptar: boolean = true;


	@ViewChild('grd', {static: true}) table: any;
	@ViewChild('rightTmpl', {static: true})  rightTmpl: TemplateRef<any>;
	@ViewChild('centerTmpl', {static: true}) centerTmpl: TemplateRef<any>;

	constructor (private hostService: CmWsHostService
		, private formBuilder: FormBuilder
		, public  dialog: MatDialog
		, private router: Router
		, private location: Location
		, public  utilService: CmUtilService
		, private contextService: CmContextService
		, private bcxRs260TblPrm: BCX_RS_260_TBL_PRM
		, private bcxRs200160Bank: BCX_RS_200_160_BANK
		){}

	ngOnInit() {
		this.formDef();
    this.controlesDef();
    
    // Definicion de columnas.
		this.tableCols = [
			{ prop:'fld_cor_dir_swf', name:'Código BIC', width:'150', headerClass:'gridHeader'},
			{ prop:'fld_cor_nom_suc', name:'Nombre', width:'450', headerClass:'gridHeader'},
			{ prop:'gls_PAI', name:'País', width:'200', headerClass:'gridHeader'},
    ];
    
		// Mensajes a desplegar por la grilla.
		this.utilService.setTableMsg(this.table);
    
		// Recuperamos el contexto.
		const ctxSw :boolean = this.contextService.recover(this);		

		this.controlName = this.contextService.getUserData('controlName')
		if (!ctxSw) {
			this.txtCodigoBIC.enable();
			this.txtPais.disable();
			this.cbbPais.disable();
			this.txtPlaza.disable();
			this.cmdPlaza = true;
       
      // Combos llenados al inicio.
		 	this.waitShow = true;
		 	this.wsFin = [];
			this.wsFin.push(false);
			this.bcxRs260TblPrm.call (
					(value) => this.getComboData0(value)
				, (value) => this.processFault(value)
				, 'PAIS'
				, ''
				, this.hostService.getTokenUser()
			);

		}
		else {
			this.txtCodigoBIC.disable();
			this.txtPais.disable();
			this.cbbPais.disable();
			this.txtPlaza.enable();
			this.cmdPlaza = false;
			this.codigoPlaza = this.contextService.getUserData("codigoPlaza");
			this.txtPlaza.patchValue(this.codigoPlaza);
    }

		this.codigoBic = this.contextService.getUserData("bicBanco");
		// Numericos y uppercase.
		this.valueChanges();

    // Validadores de Combo-Texto.
    this.validatorsDef();
	}	
  
	/**
	 * Posicion de scroll.
	 */
	ngAfterViewChecked()
	{
		this.tableAfterView = this.utilService.scrollPos(this.table, this.tableScroll, this.tableAfterView);
	}

	/**
	 * Llenado de combo cbbPais
	 */
	private getComboData0(wsResult: CmWsResult): void
	{
		this.cbbPaisArray = wsResult.getTableRows();
		this.getComboDataFin(0, wsResult);
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

	optRadioGroup_change():void{

		switch (this.optCodigoGrl1.value){

			case 'SW': {
				this.txtCodigoBIC.enable();
				this.txtPais.disable();
				this.cbbPais.disable();
				this.txtPlaza.disable();
				this.cbbPlaza.disable();
				this.cmdPlaza = true;
				this.txtPlaza.patchValue('');
				this.cbbPlaza.patchValue('');

				break;
			}
			case 'PA': {

				this.txtCodigoBIC.disable();
				this.txtCodigoBIC.patchValue('');
				this.txtPais.enable();
				this.cbbPais.enable();
				this.txtPlaza.disable();
				this.cbbPlaza.disable();
				this.cmdPlaza = true;
				this.txtPlaza.patchValue('');
				this.cbbPlaza.patchValue('');
				break;

      } 
      case 'PL': {

				this.txtCodigoBIC.disable();
				this.txtCodigoBIC.patchValue('');
				this.txtPais.disable();
				this.cbbPais.disable();
				this.txtPlaza.enable();
				this.cmdPlaza = false;
				this.txtPais.patchValue('');
				this.cbbPais.patchValue('');
				break;
			}
		}
  }
  
	/**
	 * Evento click del boton cmdBuscar.
	 */
	cmdBuscar_click(): void
	{
		let cOpcion:any;
		let cCodigo:any;

		this.waitShow = false;
		if(this.optCodigoGrl1.value == 'SW'){
			cOpcion = 'CR';
			cCodigo = '0';

			if 	((this.txtCodigoBIC.value).trim() == ''){
				this.utilService.alert(this.dialog, 'Ingrese Código BIC');				
				return;
			}			
		}
		if(this.optCodigoGrl1.value == 'PA'){
			cOpcion = 'PS';
			cCodigo = this.txtPais.value;

			if 	((this.txtPais.value).trim() == ''){
				this.utilService.alert(this.dialog, "Ingrese Código País");
				
				return;
			}			
		}

		if(this.optCodigoGrl1.value == 'PL'){
			cOpcion = 'PL';
			cCodigo = this.txtPlaza.value;

			if 	((this.txtPlaza.value).trim() == ''){
				this.utilService.alert(this.dialog, "Ingrese Código Plaza");				
				return;
			}			
		}

		this.bcxRs200160BankCall(cOpcion,cCodigo,this.txtCodigoBIC.value);
  }
  
	/**
	 * Evento click del boton cmdAceptar.
	 */
	cmdAceptar_click(): void {
		
		this.waitShow = false;		
    this.codigoBic = this.tableSelected[0].fld_cor_dir_swf;
		// let glosaBanco = this.tableSelected[0].fld_cor_nom_suc;

		this.contextService.setUserData(this.controlName, this.codigoBic);
    this.location.back();
    
	}

	/**
	 * Evento click del boton cmdVolver.
	 */
	cmdVolver_click(): void
	{
		// this.contextService.setUserData("opcionBanco",'0');
		this.location.back();
  }
  
	cmdPLaza_click():void{
		this.contextService.store(this);
		this.waitShow = false;
		this.contextService.setUserData("bicBanco", this.codigoBic);
    this.contextService.setUserData("codigoPais", this.txtPais.value);
    this.contextService.setUserData("codigoPlaza", this.txtPlaza.value);
		this.router.navigate(['/consultaPlaza']);
	}

	/**
	 * Callback para el caso de error en llamada a Web Service.
	 */
	private processFault(err: any): void
	{
		this.waitShow = false;
		this.utilService.alert(this.dialog, err.error);
	}

	/**
	 * Filtro de la tabla.
	 */
	private tableFilter(value :string): void
	{
		const val :string = value.toLowerCase();
		const temp = this.tableRowsTemp.filter(d => {
			return !val
			|| this.utilService.hayVal(d.fld_cor_dir_swf, val)
			|| this.utilService.hayVal(d.fld_cor_nom_suc, val)
			|| this.utilService.hayVal(d.gls_PAI, val)
		});
		this.tableRows = temp;
		// Volvemos a la primera pagina.
		this.table.offset = 0;

		if (val != "") {
			this.tableSelected[0] = {};
		}
	}

	/**
	 * Click o dobleclick en la grilla.
	 * @param event click, dblclick, etc.
	 */
	onTableActivate(event): void
	{
		if (event.type == 'dblclick')
		{
			this.waitShow = false;
			this.cmdAceptar_click();			
		}
		if (event.type == 'click'){			
			this.disableBtnAceptar = false;
		}
	}

	/**
	 * Sort de la grilla. Para salvar el estado.
	 * @param event Datos del Sort (Columna y direccion).
	 */
	onTableSort(event): void
	{
		 this.tableSort['prop'] = event.sorts[0].prop;
		 this.tableSort['dir'] = event.sorts[0].dir;
	}

	/**
	 * Scroll de la grilla. Para salvar el estado.
	 * @param event Contiene la posicion del scroll.
	 */
	onTableScroll(event): void
	{
		 this.tableScroll = event.offsetY;
	}

	/**
	 * Seleccion de fila de la grilla. 
	 * Para manejar enabled/disabled de botones y otros.
	 * @param selected Arreglo de Filas seleccionadas.
	 */
	onTableSelect({ selected }): void
	{
		 const fila = selected[0];
	}

	/**
	 * Controles del formulario.
	 */
	private formDef(): void
	{
		this.form = this.formBuilder.group({
			txtCodigoBIC:'',
			txtPais:'',
			cbbPais:'',
			txtPlaza:'',
			cbbPlaza:'',
			txtTableFilter: '',
			optCodigoGrl1: 'SW',
			optCodigoGrl2: '',
			optCodigoGrl3: ''
		});
	}

	/**
	 * Nombres de controles para simplificar su uso.
	 */
	private controlesDef(): void
	{
		this.txtCodigoBIC = this.form.controls['txtCodigoBIC'];
		this.txtPais = this.form.controls['txtPais'];
		this.cbbPais = this.form.controls['cbbPais'];
		this.txtPlaza = this.form.controls['txtPlaza'];
		this.cbbPlaza = this.form.controls['cbbPlaza'];
		this.optCodigoGrl1 = this.form.controls["optCodigoGrl1"];
		this.optCodigoGrl2 = this.form.controls["optCodigoGrl2"];
		this.optCodigoGrl3 = this.form.controls["optCodigoGrl3"];
	}

	/**
	 * Validadores de texto - combo.
	 */
	private validatorsDef(): void
	{
		this.txtPais.setValidators(CmTextoComboValidator(this.cbbPaisArray, 'fld_cod_prm'));
		// this.txtPlaza.setValidators(CmTextoComboValidator(this.cbbPlazaArray, 'fld_cod_prm'));
	}

	/**
	 * Atrapa los cambios a los campos del formulario.
	 * Adecuado para uppercase y valor inicial de BcxNumero.
	 */
	private valueChanges(): void
	{
		this.form.controls['txtTableFilter'].valueChanges.subscribe((value) => {
			this.tableFilter(value);
			this.disableBtnAceptar = true;
		});

		this.txtPais.valueChanges.subscribe((value) => {
			this.utilService.comboTexto_changeSelect(this.cbbPais, value);
		});

		this.cbbPais.valueChanges.subscribe((value) => {
			this.utilService.textoCombo_change(this.txtPais, value);
		});

		this.txtCodigoBIC.valueChanges.subscribe(
			() => {this.utilService.toUpper(this.txtCodigoBIC);}
		);

		this.txtPais.valueChanges.subscribe(
			() => {this.utilService.toUpper(this.txtPais);}
		);

		this.txtPlaza.valueChanges.subscribe(
			() => {this.utilService.toUpper(this.txtPlaza);}
		);
  }
  
	/**
	 * Llamamos al Web Service.
	 */
	private bcxRs200160BankCall(cOpcion:any, cCodigo:any, cCodigoBic:any): void
	{
		// Activamos el simbolo de progress.
		this.waitShow = true;
		// Invocamos el WS.
		this.bcxRs200160Bank.call(
			  (value) => this.bcxRs200160BankResult(value)
			, (value) => this.processFault(value)
			, cOpcion
			, cCodigo
			, cCodigoBic
			, this.hostService.getTokenUser()
		);

		// Aca no puede haber nada que dependa del resultado (asincrono).

  }
  
	/**
	 * Callback invocado por this.bcxWs200160Bank.call.
	 * @param wsResult Filas de la tabla, parametros de salida, mensaje de error.
	 */
	bcxRs200160BankResult(wsResult :CmWsResult): void
	{		
		// Desactivamos el simbolo de progress.
		this.waitShow = false;
		// Obtenemos las filas.
		this.tableRows = wsResult.getTableRows();
		this.tableRowsTemp = this.tableRows;

		// A veces el Fault se viene por aca.
		let hayError: boolean = wsResult.hayError();
		if (hayError)
		{
			let msg: string = wsResult.getErrorMsg();
			let code: string = wsResult.getErrorCode();
			this.utilService.alert(this.dialog, msg + ' [' + code + ']');
		}
		// Primera pagina.
		this.table.offset = 0;
  }
}


