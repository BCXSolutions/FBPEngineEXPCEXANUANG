import { Injectable }     from '@angular/core';

/**
 * Obtener una referencia a window para el evento paste.
 */
function getWindow (): any {
    return window;
}

@Injectable()
export class CmWindowRefService {
    get nativeWindow (): any {
        return getWindow();
    }
}