import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AudioPlayerControlService {

  private activePlayerIdSubject = new BehaviorSubject<string | null>(null);
  activePlayerId$ = this.activePlayerIdSubject.asObservable();

  setActivePlayer(playerId: string) {
    this.activePlayerIdSubject.next(playerId);
  }

  stopAllExcept(playerId: string) {
    this.activePlayerIdSubject.next(playerId);
  }
}
