import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[formGroup]'
})
export class StyleViewDirective {

  constructor(
    private element: ElementRef,
    private renderer:Renderer2  
  ) { }

  ngAfterViewInit(){
    this.forceStyle();    
  }

  @HostListener('window:resize', ['$event']) onResize(event: Event) {
    this.forceStyle();
  }

  forceStyle() {
    if (this.element.nativeElement.querySelectorAll('.cm-botonera').length > 0 ) {
      let divElBotonera :any = this.element.nativeElement.querySelectorAll('.cm-botonera')[0];
      let divElContent :any = this.element.nativeElement.querySelectorAll('.inner-sidenav-content')[0];
      let pixel: string = (divElBotonera.offsetHeight + 41) + 'px';

      console.log('divElement.offsetHeight', divElBotonera.offsetHeight );
      console.log('pixel', pixel );  

      this.renderer.setStyle(divElContent, 'top', pixel);
      this.renderer.setStyle(divElBotonera, 'padding', '5px 10px 10px');
    }
  }

}


