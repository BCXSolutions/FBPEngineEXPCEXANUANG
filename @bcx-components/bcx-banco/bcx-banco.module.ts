
import { NgModule }      from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CmSharedModule } from '@bcxang';

import { BcxBancoComponent } from './bcx-banco.component';
import { ConsultaBancoComponent } from './consulta-banco.component';
import { PlazaBancosComponent } from './plaza-banco.component';

import { BcxBancoRoutingModule } from './bcx-banco-routing.module'

@NgModule({
  imports: [ 
    CmSharedModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,    
    MatDialogModule,
    CommonModule,
    BcxBancoRoutingModule,
    MatToolbarModule,
    MatRadioModule,
    MatSelectModule
  ],
  declarations: [
    BcxBancoComponent,
    ConsultaBancoComponent,
    PlazaBancosComponent    
  ],
  entryComponents: [        
  ], 
  exports: [
    BcxBancoComponent
  ],
  providers: [       
  ]
  
})
export class BcxBancoModule { }