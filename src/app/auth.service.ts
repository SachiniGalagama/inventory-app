import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from '@angular/fire/auth';
import { doc, Firestore, setDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth, private firestore: Firestore) {}

  async register(email: string, password: string): Promise<UserCredential> {
  const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
  
  // Create a user document in Firestore after successful registration
  const uid = userCredential.user.uid;
  const userDocRef = doc(this.firestore, `users/${uid}`);

  await setDoc(userDocRef, {
    email: email,
    createdAt: new Date()
    // You can add more default user data here
  });

  return userCredential;
}


  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }
}
