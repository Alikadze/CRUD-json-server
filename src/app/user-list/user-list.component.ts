import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent{
  userService = inject(UserService);

  users$ = this.userService.getUsers();
  
  deleteUser (id: string) {
    this.userService.deleteUser(id).subscribe(() => {
      this.users$ = this.userService.getUsers();
    })
  }
  
}
