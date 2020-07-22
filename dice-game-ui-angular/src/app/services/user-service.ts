import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { SocialAuthService, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';

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
  private userSubject = new ReplaySubject<User>();

  constructor(private authService: SocialAuthService) {
    this.localUser = { id: 'local player', name: 'local player' } as User;
    this.userSubject.next(this.localUser);

    this.authService.authState.subscribe((socialUser) =>
      this.userSubject.next(
        socialUser
          ? ({ id: socialUser.email, name: socialUser.name, photoUrl: socialUser.photoUrl } as User)
          : this.localUser
      )
    );
  }

  isLoggedIn(user: User): boolean {
    return user !== this.localUser;
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
