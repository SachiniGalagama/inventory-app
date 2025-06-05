import { Injectable } from '@angular/core';
import {
  Auth,
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private auth: Auth) {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  register(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
