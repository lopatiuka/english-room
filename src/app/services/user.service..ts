import { Injectable } from "@angular/core";
import { get, getDatabase, onValue, push, ref, remove, set } from "firebase/database";
import { database } from "../firabase/init";
import { Subject } from "rxjs";
import { User } from "../models/user.model";


@Injectable({
    providedIn: 'root'
})
export class UserService {
    private usersRef = ref(database, 'users/');
    private currentUserRef = ref(database, 'currentUser/');

    public users$: Subject<Array<User>> = new Subject();
    public currentUser$: Subject<User> = new Subject();
    public maxLengthError: Subject<boolean> = new Subject();

    constructor() {}

    async addUser(name: string): Promise<string> {
        const snapshot = await get(this.usersRef)
        const data = snapshot.val();
        const newUserRef = push(this.usersRef)
        let ids = [];
        
        if(data) {
            ids = Object.keys(data);
        }

        if(ids.length < 3) {
            set(newUserRef, {
                id: newUserRef.key,
                name: name
            })
        }
        else {
            return "";
        }

        return newUserRef.key || '';
        
    }

    subscribeUsers() {
        onValue(this.usersRef, (snapshot) => {
            const data = snapshot.val();
            this.users$.next(data);
        })
    }

    async removeUser(uid: string) {
        const snapshot = await get(this.usersRef);
        const data = snapshot.val();
        
        if(Object.keys(data).length === 1) {
            this.setCurrentUser(null);
        }

        remove(ref(database, 'users/' + uid));
    }

    setCurrentUser(user: User | null) {
        set(this.currentUserRef, user);
    }

    subscribeCurrentUser() {
        onValue(this.currentUserRef, (snapshot) => {
            const data = snapshot.val();
            this.currentUser$.next(data);
        })
    }
}