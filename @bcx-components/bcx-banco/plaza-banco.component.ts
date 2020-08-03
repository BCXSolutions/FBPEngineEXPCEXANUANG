// Generado por Xml2Ang, Bcx Solutions 
// Fecha: 04/12/2017 17:23:15
import { AfterViewChecked, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';

// Componentes y objetos Bcx
import { 
		CmContextService
	, CmWsHostService
	, CmUtilService
	, CmWsResult 
} from '@bcxang';

// Web Services
import { BCX_RS_260_TBL_PRM } from './services/BCX_RS_260_TBL_PRM.service';

/**
 * Form: Plaza
 */
@Component({
	selector: 'plaza-bancos',
	templateUrl: 'plaza-banco.component.html'
})
export class PlazaBancosComponent implements OnInit, AfterViewChecked
{
	// Nombre de la pagina.
	pageName: string = 'CodigoPlazaBancos';
	// Estructura con los datos del form.
	form: FormGroup;
	
	// Objetos de input.
	codPlaza:any;
	
	// Activa o desactiva el progress.
	waitShow: boolean;
	// Registro de los WS finalizados.
	wsFin: boolean[] = [];
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

	constructor (
			private hostService: CmWsHostService
		, private formBuilder: FormBuilder
		, public  dialog: MatDialog
		, private router: Router
		, private location: Location
		, public  utilService: CmUtilService
		, private contextService: CmContextService
		, private bcxRs260TblPrm: BCX_RS_260_TBL_PRM
	){}

	/**
	 * Inicializamos todo.
	 */
	ngOnInit()
	{
		// Definicion de columnas.
		this.tableCols = [
			{ prop:'fld_cod_prm', name:'Código', width:'80', cellTemplate: this.rightTmpl, headerClass:'gridHeader'},
			{ prop:'fld_des_prm', name:'Descripción', width:'300', headerClass:'gridHeader'},
		];
		// Mensajes a desplegar por la grilla.
		this.utilService.setTableMsg(this.table);
		// Campos del formulario.
		this.formDef();
		this.controlesDef();
		// Numericos y uppercase.
		this.valueChanges();

		this.bcxRs260TblPrmCall();
	}

	/**
	 * Llamamos al Web Service.
	 */
	private bcxRs260TblPrmCall(): void
	{
		/* Mover los datos de la pantalla a los parametros del Web Service. */ 
		let nem_tbl :string = 'PLAZAS';
		let fil_prm :string = '';
		 
		// Activamos el simbolo de progress.
		this.waitShow = true;
		// Invocamos el WS.
		this.bcxRs260TblPrm.call (
			(value) => this.bcxRs260TblPrmResult(value)
			, (value) => this.processFault(value)
			, nem_tbl
			, fil_prm
			, this.hostService.getTokenUser()			
		);
		// Aca no puede haber nada que dependa del resultado (asincrono).

	}

	/**
	 * Callback invocado por this.bcx260TblPrm.call.
	 * @param wsResult Filas de la tabla, parametros de salida, mensaje de error.
	 */
	bcxRs260TblPrmResult(wsResult :CmWsResult): void
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

	/**
	 * Posicion de scroll.
	 */
	ngAfterViewChecked()
	{
		this.tableAfterView = this.utilService.scrollPos(this.table, this.tableScroll, this.tableAfterView);
	}

	/**
	 * Evento click del boton cmdAceptar.
	 */
	cmdAceptar_click(): void
	{
		this.waitShow = false;
		if(this.tableSelected[0]==null || this.tableSelected[0]==''){
			this.utilService.alert(this.dialog, "Debe seleccionar una plaza");
		} else {
			this.codPlaza = this.tableSelected[0].fld_cod_prm;
			if(this.codPlaza == '' || this.codPlaza == null){
				this.contextService.setUserData("codigoPlaza","");
			} else {
				this.contextService.setUserData("codigoPlaza", this.codPlaza );
			}
			this.cmdVolver_click()
		}

	}

	/**
	 * Evento click del boton cmdVolver.
	 */
	cmdVolver_click(): void
	{
		this.location.back();
	}

	/**
	 * Callback para el caso de error en llamada a Web Service.
	 */
	private processFault(msg: string): void
	{
		this.waitShow = false;
		this.utilService.alert(this.dialog, msg);
	}

	/**
	 * Filtro de la tabla.
	 */
	private tableFilter(value :string): void
	{
		const val :string = value.toLowerCase();
		const temp = this.tableRowsTemp.filter(d => {
			return !val
			|| this.utilService.hayVal(d.fld_cod_prm, val)
			|| this.utilService.hayVal(d.fld_des_prm, val)
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
			txtTableFilter: ''
		});
	}

	/**
	 * Nombres de controles para simplificar su uso.
	 */
	private controlesDef(): void
	{
	}

	/**
	 * Validadores de texto - combo.
	 */
	private validatorsDef(): void
	{
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
	}
}
