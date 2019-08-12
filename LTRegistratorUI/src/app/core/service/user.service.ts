import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { shareReplay, map } from 'rxjs/operators';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUser: User = new User(+localStorage.getItem('userId'), '', '', '', '', []);
  user$: Observable<User>;

  constructor(private http: HttpClient) {
  }

  public getUserInfo() {
    if (!this.user$) {
      this.user$ = this.http.get<User>(this.getUrl()).pipe(
        map((user: any) => {
          this.currentUser = new User(user.id, user.firstName, user.secondName,
            user.mail, user.maxRole, user.projects);
          return this.currentUser;
        }),
        shareReplay(1)
      );
    }
    if (localStorage.getItem('id_token')) {
      return this.user$;
    }
  }
  public getUserId() {
    return this.currentUser.id;
  }

  public setUserId(id: number) {
    this.currentUser.id = id;
  }

  private getUrl() {
    return `http://localhost:5000/api/employee/${this.currentUser.id}/info`;
  }
}