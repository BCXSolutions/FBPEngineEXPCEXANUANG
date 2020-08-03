import { Component, OnInit, Input, Optional, Self, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ControlValueAccessor, NgControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { 
  CmUtilService, 
  CmWsResult, 
  CmContextService, 
  CmWsHostService, 
  CmFocusEmitterService 
} from '@bcxang';


import { BCX_RS_200_160_BANK } from './services/BCX_RS_200_160_BANK.service';

@Component({
  selector: 'bcx-banco',
  templateUrl: 'bcx-banco.component.html',
  styleUrls: ['bcx-banco.component.scss']
})
export class BcxBancoComponent implements OnInit, ControlValueAccessor, OnChanges {
  @ViewChild('bcxBanco') bcxBancoNative: ElementRef;
	// Nombre de la pagina.
	pageName: any;
  form: FormGroup;
  txtCodBanco: any;
  txtDesBanco: any;
    
  private _initialValue: string;

  waitShow: boolean;

  constructor(    
    @Optional() @Self() public ngControl: NgControl, 
    private focusEmitterService: CmFocusEmitterService,
    private hostService: CmWsHostService,   
    private formBuilder: FormBuilder,
    public  dialog: MatDialog,
    public  utilService: CmUtilService,
    private bcxRs200160Bank: BCX_RS_200_160_BANK,
    private router: Router,
    private contextService: CmContextService
  ) {
    // this.form = parent.form;
    // Replace the provider with this.
    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }
  }
  

  @Input() placeholder: string = "Código";  
  @Input() class: string = "";
  @Input() hideDescription: boolean = false;
  @Input() colSpan: string = "6";
  @Input() widthCodigo: string = "22";
  @Input() tabindex: string = "0";  
  @Input() placeholderDes: string = "Descripción";
  @Input() isDisabled: boolean = false;
  @Input() data: any;

  validate(ctrl) {
    // If you have multiple validators, you'd probably 
    // want to build the error object from scratch
    return this.txtCodBanco.errors;
  }

  // Lo siguiente es para implementar ControlValueAccessor
  // writeValue, registerOnChange, registerOnTouched, setDisabledState
  writeValue(value: any) {     
    if (value !== undefined) {      
      this._initialValue = value.toUpperCase();       
      this.pageName = this.ngControl.name;
 
      if (this.txtCodBanco !== undefined){
        this.txtCodBanco.patchValue(value.toUpperCase());

        if (value == "") {
          this.contextService.setUserData(this.pageName, value);
          this.txtDesBanco.patchValue("");
        }
      }
    }
  }

  propagateChange = (_: any) => { };

  registerOnChange(fn: (_: any) => void) {    
    this.propagateChange = fn;
  }
  
  onTouch = () => { }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  ngOnInit() {        
    if (this.form == undefined){
      this.formDef();
      this.controlesDef();
    }    
    this.valueChanges();
        
    // Recuperamos el contexto.
    const ctxSw :boolean = this.contextService.recover(this);
    
    let variable = this.contextService.getUserData("controlName"); 
    
    if (variable == this.ngControl.name) {      
      this.txtCodBanco.patchValue(this.contextService.getUserData(variable));
      
      setTimeout(() => {
        this.bcxBancoNative.nativeElement.focus()
      }, 700)
    }
    
    if(this.txtCodBanco.value != ""){
      setTimeout(() => {
        this.bcxRs200160BankCall();
      }, 100)
    }
    
    if (this.ngControl != null) {      
      this.ngControl.control.setValidators([this.validate.bind(this)]);
      this.ngControl.control.updateValueAndValidity();
    }  
    
    this.focusEmitterService.invokeFocusFunction.subscribe(
      (name: string) => {this.setFocus(name);    
    }); 
  }

	ngOnChanges(changes: SimpleChanges) {    
    if (this.form == undefined){
      this.formDef();
      this.controlesDef();
    }

    if(changes.isDisabled != undefined) { 
      if(changes.isDisabled.currentValue != undefined) {      
        if(changes.isDisabled.currentValue) {
          this.txtCodBanco.disable();
        } 
        else {
          this.txtCodBanco.enable();
        }
      }
    }
  }

  /**
	 * Controles del formulario.
	 */
	private formDef(): void	{
		this.form = this.formBuilder.group({
      txtCodBanco: this._initialValue,
      txtDesBanco: [{ value:"", disabled: true}]
		});
  }
  
  /**
	 * Nombres de controles para simplificar su uso.
	 */
	private controlesDef(): void {
    this.txtCodBanco = this.form.controls['txtCodBanco'];
    this.txtDesBanco = this.form.controls['txtDesBanco'];
  }
  
  private valueChanges(): void {
    this.txtCodBanco.valueChanges.subscribe((value: any) => {
        this.utilService.toUpper(this.txtCodBanco)
        this.propagateChange(value);
    });
  }

  /**
	 * Callback para el caso de error en llamada a Web Service.
	 */
	private openDialogAlert(msg: string): void {
		this.waitShow = false;
		this.utilService.alert(this.dialog, msg);
	}

  /**
   * Llamamos al Web Service de Bancos
   */
  carga_codigo_banco_change(): void {    
    if(this.txtCodBanco.value != ""){
      this.bcxRs200160BankCall();
    } 
    else {
      this.txtDesBanco.patchValue("")
    }
  }

  /**
   * 
   */

  btnConsulta_click(): void {
    this.contextService.store(this);
    this.contextService.store(this.data);

    this.contextService.setUserData('controlName',this.ngControl.name);
    this.contextService.setUserData(this.pageName, this.txtCodBanco.value);


    console.log("IE = ", /msie\s|trident\/|edge\//i.test(window.navigator.userAgent))
    if(/msie\s|trident\/|edge\//i.test(window.navigator.userAgent)){
      setTimeout(() => {					
        this.router.navigate(['/consultaBanco']);
      }, 100);
    }
    else {
      this.router.navigate(['/consultaBanco']);
    }

  }

  /**
	 * Callback para el caso de error en llamada a Web Service.
	 */
	private processFault(err: any): void
	{
		this.waitShow = false;
    this.utilService.alert(this.dialog, err.error);
    this.txtDesBanco.patchValue("");
    this.errorCodBanco();
  }
  
  /**
   * Activa error del codigo banco.
   */
  errorCodBanco() {
    this.form.get('txtCodBanco').markAsTouched();
    this.form.get('txtCodBanco').setErrors({});
  }
  
  /**
	 * Llamamos al Web Service.
	 */
	private bcxRs200160BankCall(): void
	{    
		/* Mover los datos de la pantalla a los parametros del Web Service. 
		IMPORTANTE: Para variables Rut, usar: this.utilService.toRut(this.variableRut.value); */ 
		let wss_cod_ing: string = 'CR';
		let wss_cod_bus: number = 0;
		let wss_cod_bank: string = this.txtCodBanco.value;
		let wss_usercode: string = this.hostService.getTokenUser();
		 
		// Activamos el simbolo de progress.
		this.waitShow = true;
		// Invocamos el WS.
		this.bcxRs200160Bank.call(
			  (value) => this.bcxRs200160BankResult(value)      
      , (value) => this.processFault(value)
			, wss_cod_ing
      , wss_cod_bus
      , wss_cod_bank
      , wss_usercode
		);

		// Aca no puede haber nada que dependa del resultado (asincrono).

  }
  
  /**
	 * Callback invocado por this.getNotificationsResult.call.
	 * @param wsResult Parametros de salida, mensaje de error.
	 */
	bcxRs200160BankResult(wsResult :CmWsResult): void
	{    
    // Desactivamos el simbolo de progress.    
    let hayError: boolean = wsResult.hayError();
    if (hayError) {
      let msg: string = wsResult.getErrorMsg();
      let code: string = wsResult.getErrorCode();
      this.utilService.alert(this.dialog, msg + ' [' + code + ']');
      this.txtDesBanco.patchValue("");
      this.errorCodBanco();      
    }
    else {
      if (wsResult.getTableRows().length > 1) {
        this.openDialogAlert("BCX_RS_200_160_BANK No existen Bancos - Segun criterio de busqueda");
        this.txtDesBanco.patchValue('');  
        this.errorCodBanco();      
      } 
      else if (wsResult.getTableRows().length == 1 && wsResult.getTableRows()[0].fld_cor_dir_swf != this.txtCodBanco.value ) {
        this.openDialogAlert("BCX_RS_200_160_BANK No existen Bancos - Segun criterio de busqueda");
        this.txtDesBanco.patchValue('');
        this.errorCodBanco();
      }
      else {
        this.txtDesBanco.patchValue(wsResult.getTableRows()[0].fld_cor_nom_suc);
        this.contextService.setUserData(this.pageName, this.txtCodBanco.value);
      }
    }    
		// A veces el Fault se viene por aca.

  }
  setFocus(name: string) {
    if (name === this.ngControl.name)
    this.bcxBancoNative.nativeElement.focus();
  }
}
