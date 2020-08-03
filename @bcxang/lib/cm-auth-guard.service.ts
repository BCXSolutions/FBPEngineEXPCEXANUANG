import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { CmAuthService } from './cm-auth.service';
@Injectable()
export class CmAuthGuardService implements CanActivate {
  constructor(public auth: CmAuthService, public router: Router) {}
  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
    //  this.router.navigate(['cm-login']);
      return false;
    }
    return true;
  }
}