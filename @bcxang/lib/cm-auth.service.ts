
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CmWsHostService } from './cm-ws-host.service';
@Injectable()
export class CmAuthService {
    constructor(public hostService: CmWsHostService) { }

    public isAuthenticated(): boolean {

        const token = this.hostService.getToken();
        if (token == null)
            return false;
/** 
        const helper = new JwtHelperService();

        const decodedToken = helper.decodeToken(token);
        const expirationDate = helper.getTokenExpirationDate(token);
        const isExpired = helper.isTokenExpired(token);
        */
        return true;
    }
}