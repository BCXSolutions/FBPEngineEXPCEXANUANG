export const CmInitialState: CmIState = {
    counter: 0,
    loggedIn: false
};

/**
 * Interfaz para el manejo del estado de soporte de timeout.
 */
export interface CmIState {
    counter: number;
    loggedIn: boolean;
}