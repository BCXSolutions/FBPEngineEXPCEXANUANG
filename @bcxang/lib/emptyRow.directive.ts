import { Directive, ElementRef, OnInit, AfterViewChecked } from '@angular/core';

@Directive({
    selector: '[emptyRow]'
})
export class EmptyRowDirective implements OnInit, AfterViewChecked {

    textElement: any;
    active: boolean = true;

    constructor(private hostElement: ElementRef) {
    }

    ngOnInit() {   
      this.textElement = this.hostElement.nativeElement.getElementsByClassName('datatable-body')[0];
      this.textElement.addEventListener("scroll", event => { 
        let text = this.textElement.innerText.trim();
        this.active = text.includes('No hay datos.')
        if (this.active) {
          this.hostElement.nativeElement.getElementsByClassName('datatable-header')[0].scrollLeft = event.srcElement.scrollLeft;
        }
        else{
          this.hostElement.nativeElement.getElementsByClassName('datatable-header')[0].scrollLeft = 0          
        }        
      });
    }

    ngAfterViewChecked(){
      let text = this.textElement.innerText.trim();
      this.active = text.includes('No hay datos.')
      if (this.active) {
        this.hostElement.nativeElement.getElementsByClassName('empty-row')[0].style.width = this.hostElement.nativeElement.getElementsByClassName('datatable-row-center')[0].style.width;
      }

    }

}