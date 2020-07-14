import { SocialAuthService, SocialUser, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { Injectable } from '@angular/core';

export type AuthUserEventHandler = (user: User) => void;

export interface User {
  id: string;
  name: string;
}

@Injectable()
export class UserService {
  private readonly localUser: SocialUser;
  private user: SocialUser;
  private onAuthStateChangedEventHandlers: AuthUserEventHandler[] = [];

  constructor(private authService: SocialAuthService) {
    this.localUser = new SocialUser();
    this.localUser.email = 'local player';
    this.user = this.localUser;
    this.authService.authState.subscribe((user) => {
      this.user = user ?? this.localUser;
      this.onAuthStateChangedEventHandlers.forEach((handler) =>
        handler({ id: this.user.email, name: this.user.name } as User)
      );
    });
  }

  get userId(): string {
    return this.user.email;
  }

  get userPhotoUri(): string {
    return this.user.photoUrl;
  }

  get isLoggedIn(): boolean {
    return this.user !== this.localUser;
  }

  registerOnAuthStateChanged(handler: AuthUserEventHandler): void {
    if (!handler) {
      throw new Error('Handler should be defined');
    }

    this.onAuthStateChangedEventHandlers.push(handler);
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
