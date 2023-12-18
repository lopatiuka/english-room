import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, map, of } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service.';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler() {
    this.uid && this.userService.removeUser(this.uid)
  }

  uid?: string;
  users$?: Observable<Array<User>>;
  currentAskingIndex: number = 0;
  currentUser?: User;
  users?: any;
  maxLengthError: boolean = false;

  constructor(
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.users$ = this.userService.users$.pipe(
      map(users => {
        this.users = users;
        return users;
      })
    );

    this.userService.currentUser$.subscribe(user => this.currentUser = user);

    this.userService.subscribeUsers();
    this.userService.subscribeCurrentUser();

    const dialogRef = this.dialog.open(DialogComponent, {disableClose: true});
    dialogRef.afterClosed().subscribe( async name => {
      this.uid = await this.userService.addUser(name);

      if(!this.uid) {
        this.dialog.open(DialogComponent, {
          data: {
            maxLengthError: true
          },
          disableClose: true
        })
      }
    })
  }
  
  ngOnDestroy(): void {
    this.uid && this.userService.removeUser(this.uid);
  }

  nextUser() {
    const ids: Array<string> = Object.keys(this.users!);
    let nextUserId = "";

    if(this.currentUser) {
      const currentUserIndex = ids.findIndex(userId => userId === this.currentUser!.id);
      nextUserId = ids[currentUserIndex + 1];
    }
    
    if(nextUserId) {
      this.userService.setCurrentUser(this.users[nextUserId]);
    }
    else {
      this.userService.setCurrentUser(this.users[ids[0]]);
    }
  }

  removeUser(uid: string) {
    this.userService.removeUser(uid);
  }
} 
