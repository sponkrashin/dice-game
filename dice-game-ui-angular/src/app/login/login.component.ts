import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  userName: string;
  userPhotoUri: string;
  loggedIn: boolean;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUser().subscribe((user) => {
      this.userName = user.name;
      this.userPhotoUri = user.photoUrl;
      this.loggedIn = this.userService.isLoggedIn(user);
    });
  }

  signInWithGoogle(): void {
    this.userService.signInWithGoogle();
  }

  signInWithFB(): void {
    this.userService.signInWithFB();
  }

  signOut(): void {
    this.userService.signOut();
  }
}
