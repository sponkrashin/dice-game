import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { SocialAuthService, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';

export type AuthUserEventHandler = (user: User) => void;

export interface User {
  id: string;
  name: string;
  photoUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly localUser: User;
  private user: User;
  private userSubject = new Subject<User>();

  constructor(private authService: SocialAuthService) {
    this.localUser = { id: 'local player', name: 'local player' } as User;
    this.user = this.localUser;

    this.authService.authState.subscribe((socialUser) => {
      this.user = socialUser
        ? ({ id: socialUser.email, name: socialUser.name, photoUrl: socialUser.photoUrl } as User)
        : this.localUser;
      return this.userSubject.next(this.user);
    });
  }

  getCurrentUserId(): string {
    return this.user.id;
  }

  isLoggedIn(): boolean {
    return this.user !== this.localUser;
  }

  getUser(): Observable<User> {
    return this.userSubject.asObservable();
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }
}
