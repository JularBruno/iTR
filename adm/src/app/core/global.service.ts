import { Injectable } from '@angular/core';
import { Settings } from '../app.settings';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  public settings = Settings;

  public userBehaviorSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public user: any;

  constructor() { }

  // (+) User

  /**
   * Save user
   */
  saveUser(user: any) {
    localStorage.setItem(this.settings.storage.user, JSON.stringify(user));
    this.user = user;
    this.userBehaviorSubject.next(true);
  }

  /**
   * Get user
   */
  getUser() {
    return this.user;
  }

  /**
   * Get user
   */
  isUserLogged() {
    return this.user ? true : false;
  }

  /**
   * Remove user
   */
  removeUser() {
    localStorage.removeItem(this.settings.storage.user);
    this.user = null;
    this.userBehaviorSubject.next(false);
  }

  /**
   * Get observable
   */
  getUserAsObservable(): Observable<any> {
    return this.userBehaviorSubject.asObservable();
  }

  /**
   * Check user
   */
  checkUser() {
    const u = localStorage.getItem(this.settings.storage.user);
    if (u) {
      this.user = JSON.parse(u);
      this.userBehaviorSubject.next(true);
    } else {
      this.user = null;
      this.userBehaviorSubject.next(false);
    }
    return this.user;
  }

  // (-) User

}
