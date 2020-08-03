import { Action } from '@ngrx/store';
 
export enum ActionTypes {
    INCREMENT = 'INCREMENT',
    DECREMENT = 'DECREMENT',
    RESET = 'RESET',
    USER_LOGGED_IN = 'USER_LOGGED_IN',
    USER_LOGGED_OUT = 'USER_LOGGED_OUT',
    ACTIVITY_TIMEOUT_OCCURRED = 'ACTIVITY_TIMEOUT_OCCURRED'
}

export class CmIncrement implements Action {
    readonly type = ActionTypes.INCREMENT;
  }
   
  export class CmDecrement implements Action {
    readonly type = ActionTypes.DECREMENT;
  }
   
  export class CmReset implements Action {
    readonly type = ActionTypes.RESET;
  }
  export class CmUserLoggedIn implements Action {
    readonly type = ActionTypes.USER_LOGGED_IN;
  }
  export class CmUserLoggedOut implements Action {
    readonly type = ActionTypes.USER_LOGGED_OUT;
  }
export class CmActivityTimeoutOccurred implements Action {
    readonly type = ActionTypes.ACTIVITY_TIMEOUT_OCCURRED;
  }
