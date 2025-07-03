import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public readonly isAuthenticated$: Observable<boolean> = this._isAuthenticatedSubject.asObservable();

  constructor() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this._isAuthenticatedSubject.next(isLoggedIn);
  }

  public login(username: string, password: string): boolean {
    if (username && password) {
      localStorage.setItem('isLoggedIn', 'true');
      this._isAuthenticatedSubject.next(true);
      return true;
    }
    return false;
  }

  public logout(): void {
    localStorage.removeItem('isLoggedIn');
    this._isAuthenticatedSubject.next(false);
  }

  public isLoggedIn(): boolean {
    return this._isAuthenticatedSubject.value;
  }
}
