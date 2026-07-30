import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingModalService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  private assetIdSubject = new BehaviorSubject<string | undefined>(undefined);

  isOpen$ = this.isOpenSubject.asObservable();
  assetId$ = this.assetIdSubject.asObservable();

  openModal(assetId?: string) {
    this.assetIdSubject.next(assetId);
    this.isOpenSubject.next(true);
  }

  closeModal() {
    this.isOpenSubject.next(false);
    this.assetIdSubject.next(undefined);
  }
}
