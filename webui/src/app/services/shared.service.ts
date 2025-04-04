import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private profileUpdatedSource = new BehaviorSubject<boolean>(false);
  profileUpdated$ = this.profileUpdatedSource.asObservable();

  notifyProfileUpdated() {
    this.profileUpdatedSource.next(true);
  }
}
