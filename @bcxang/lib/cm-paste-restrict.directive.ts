import { Directive, HostListener, Input } from '@angular/core';
import { CmWindowRefService } from './cm-window-ref.service';

@Directive({
  selector: '[CmRestrict]'
})
/**
 * Restringir un texto al momento de perder el foco.
 */
export class CmPasteRestrictDirective {
  private _window: any;
  constructor( private windowRef: CmWindowRefService
    
  ) { 
    this._window = windowRef.nativeWindow;
  }
  @Input() CmRestrict: string;
  @HostListener('paste', ['$event']) onPaste(event:any): boolean
  {
    let e :any = event;
    let data: string ;

    let clipboardData: any = e.clipboardData;
    if (clipboardData)
      data = clipboardData.getData('Text');
    else
      data =  this._window.clipboardData.getData('Text'); //IE

    const valid: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    for (let i: number = 0; i< data.length; i++)
    {
      let s: string = data.substr(i, 1);
      if (valid.indexOf(s) < 0)
        return false;
    }
   
    return true;
  } 
}