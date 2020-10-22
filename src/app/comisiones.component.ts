
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Componentes y objetos Bcx
import { CmWsHostService } from '@bcxang';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ 
	name: 'safeHtmlCom',
	pure: true 
})
export class SafeHtmlComPipe implements PipeTransform {  
  constructor(private sanitizer: DomSanitizer) {}
  transform(data: any) {
    return this.sanitizer.bypassSecurityTrustHtml(data)
  }
}

@Component({
	selector: 'comisiones',
	template: `<div [innerHTML]="frame | safeHtmlCom"></div>`,
	styles: ['.iframeStyle { width:100%; height: 100%; min-height: 95vh;}'],
	encapsulation: ViewEncapsulation.None,
})
export class ComisionesComponent implements OnInit {

	frame: string = "";

	constructor( 
		private hostService: CmWsHostService,
		private route: ActivatedRoute
	){}

	/**
	 * Inicializamos todo.
	 */
	ngOnInit() {
				
		let random: number = Math.random() * 10000;
		let token: string = this.hostService.getToken();
		let usuario: string = this.hostService.getUsuario();
		let host: string = this.hostService.getHost();
		let numOpe: string = this.route.snapshot.params.numOpe;
		let codIng: string = this.route.snapshot.params.codIng;
		let codPro: string = this.route.snapshot.params.codPro;
		let codEve: string = this.route.snapshot.params.codEve;
		let ini: string = "";
		
		if (this.hostService.getToken() != "") {
			ini = `?setNumOpe=${numOpe}&setCodIng=${codIng}&setCodPro=${codPro}&setCodEve=${codEve}&token=${token}&ramdom=${random}`
		} 
		else {
			ini = `?setNumOpe=${numOpe}&setCodIng=${codIng}&setCodPro=${codPro}&setCodEve=${codEve}&setUsuario=${usuario}&ramdom=${random}`
		}

		let src: string = `${host}/FBPEngineRST/FBPEngineAUXCOMANG/${ini}`
		this.frame = `<iframe class="iframeStyle" frameborder='0' src='${src}'/>`;
	}

}
