/*
BLC, 28/02/2020: V9: Cambiamos los import de angular/material.
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StoreModule } from "@ngrx/store";

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { CmBlurDirective } from './cm-blur.directive';

import { CmDialogAlertComponent } from './cm-dialog-alert.component';
import { CmWaitComponent } from './cm-wait.component';
import { CmDecimalDirective } from './cm-decimal.directive';
import { CmFocusDirective } from './cm-focus.directive';
import { CmKeypressDirective } from './cm-keypress.directive';
import { CmRestrictDirective } from './cm-restrict.directive';
import { CmPasteDirective } from './cm-paste.directive';
import { CmPasteRestrictDirective } from './cm-paste-restrict.directive';
import { CmTimeoutReducer } from './cm-timeout.reducer';
import { CmInitialState } from "./cm-istate";
import { CmNumberPipe } from "./cm-number.pipe";
import { BcxAngLibModule } from 'bcx-ang-lib';

import { EmptyRowDirective } from './emptyRow.directive';
import { StyleViewDirective } from './styleView.directive';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';

// fixed router path ''
import { APP_BASE_HREF } from '@angular/common';

//create our cost var with the information about the format that we want
export const CM_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
  },
};
/** En las declarations van los componentes, directivas y pipes.
 */
// , MatNativeDateModule

@NgModule({
  declarations: [
    CmBlurDirective
  , CmDialogAlertComponent
  , CmDecimalDirective
  , CmFocusDirective
  , CmKeypressDirective
  , CmRestrictDirective
  , CmWaitComponent
  , CmNumberPipe
  , CmPasteDirective
  , CmPasteRestrictDirective
  , EmptyRowDirective
  , StyleViewDirective

],
  imports: [
    CommonModule
    , ReactiveFormsModule
    , HttpClientModule
    , MatDatepickerModule
    , MatButtonModule
    , MatMenuModule
   
    , MatIconModule
    , MatFormFieldModule
    , MatRadioModule
    , MatDialogModule
    , MatInputModule
    , MatProgressSpinnerModule
    , NgxDatatableModule
    , StoreModule.forRoot(CmTimeoutReducer)
    , FormsModule
    , RouterModule
    , BcxAngLibModule

  ],
 
  entryComponents: [
    CmDialogAlertComponent
  ],
  exports: [
      CommonModule
    , FormsModule
    , MatDatepickerModule
    , MatButtonModule
    , MatCheckboxModule
    , MatMenuModule
    , MatIconModule
    , MatToolbarModule
    , MatFormFieldModule
    , MatRadioModule
    , MatDialogModule
    , MatInputModule
    , MatProgressSpinnerModule
    , MatSelectModule
    , MatTooltipModule
    , NgxDatatableModule
    , StoreModule
    , ReactiveFormsModule
    , CmBlurDirective
    , CmDialogAlertComponent
    , CmDecimalDirective
    , CmFocusDirective
    , CmKeypressDirective
    , CmRestrictDirective
    , CmWaitComponent
    , CmNumberPipe
    , CmPasteDirective
    , CmPasteRestrictDirective
    , EmptyRowDirective
    , StyleViewDirective
    , BcxAngLibModule
  ],
 
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es' }, //you can change useValue
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: CM_DATE_FORMATS },
    // fixed router path ''
    { provide: APP_BASE_HREF, useFactory: getBaseHref },   
  ]
})
export class CmSharedModule { }

// fixed router path ''
export function getBaseHref(): string {
  return window.location.pathname;
}
