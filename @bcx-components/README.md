# Utilización de Componentes.

1.- importar la libreria en app-user.module.ts

  - Link de app-user.module [app-user.module](../src/app/app-user.module.ts)

  ```ts
  // Importar la libreria.
  import { BcxBancoModule } from '@bcx-components';

  // Agregar la importación en el imports.
  @NgModule({  
    imports: [
      BcxBancoModule //<-- aqui se agrega la libreria importada.
    ]
  )}
  ```

2.- Utilización del tag <banco-bcx>

  - placeholder       : nombre del codigo banco.
  - placeholderDes    : nombre de la descripción banco.
  - [isDisabled]      : bloquea y desbloquea el input codigo banco y el botón.
  - [widthCodigo]     : tamaño en porcentaje (22%) del codigo banco y el botón.  
  - [colSpan]         : tamaño de celda del componente bcx-banco. (de 1 hasta 12)
  - [data]            : guarda el objeto del componente que esta llamando al bcx-banco. 
  - [hideDescription] : muestra o oculta la descripción banco.

  ```html

  <!-- COMPONENTE BANCO -->
  <bcx-banco [tabindex]="1" formControlName="txtCodigoBanco2" placeholder="BIC" placeholderDes="Descripción" [hideDescription]="true" [isDisabled]="true" [colSpan]="8" [widthCodigo]="22" [data]="this"></bcx-banco>
  
  ```




