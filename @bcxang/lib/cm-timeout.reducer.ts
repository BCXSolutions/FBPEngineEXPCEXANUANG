import { Action } from '@ngrx/store';
import { ActionTypes } from './cm-timeout.actions'
import { CmIState, CmInitialState  } from "./cm-istate";


//export const CmTimeoutReducer: ActionReducer<CmIState> 
//        = (state: CmIState, action: Action) => {

/**
 * Funcion devuelve siguiente estado.
 */
export function CmTimeoutReducer(state = CmInitialState, action: Action): CmIState { 
    switch (action.type) {
        case ActionTypes.INCREMENT:
            return {
                counter: state.counter + 1,
                loggedIn: state.loggedIn
            } as CmIState;

        case ActionTypes.DECREMENT:
            return {
                counter: state.counter - 1,
                loggedIn: state.loggedIn
            } as CmIState;

        case ActionTypes.RESET:
            return {
                counter: 0,
                loggedIn: state.loggedIn
            } as CmIState;

        case ActionTypes.USER_LOGGED_IN:
            return {
                counter: state.counter,
                loggedIn: true
            } as CmIState;

        case ActionTypes.USER_LOGGED_OUT:
        case ActionTypes.ACTIVITY_TIMEOUT_OCCURRED:
            return {
                counter: state.counter,
                loggedIn: false
            } as CmIState;

        default:
            return state;
    }
}