import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {TimeFormatPipe} from "../../pipes/time-format.pipe";
import {BehaviorSubject, Subscription} from "rxjs";
import {AudioPlayerControlService} from "../../services/audio-player-control.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [
    TimeFormatPipe,
    NgIf
  ],
  templateUrl: './audio-player.component.html',
  styleUrl: './audio-player.component.scss'
})
export class AudioPlayerComponent {
  @Input() trackSrc: string = '';
  @Input() playerId: string = ''; // Уникальный ID для каждого плеера
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;
  @ViewChild('progressInput') progressInput!: ElementRef<HTMLInputElement>;

  isPlaying = false;
  isMuted = false;
  currentTime = 0;
  duration = 0;
  private subscription: Subscription;
  private currentTimeSubject = new BehaviorSubject<number>(0);

  constructor(private audioControlService: AudioPlayerControlService) {
    this.subscription = this.audioControlService.activePlayerId$.subscribe(activeId => {
      if (activeId !== this.playerId && this.isPlaying) {
        this.pause(); // Останавливаем, если другой плеер активен
      }
    });
  }

  ngOnInit() {
    if (!this.playerId) {
      throw new Error('Player ID is required');
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  togglePlay() {
    const audio = this.audioElement.nativeElement;
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    const audio = this.audioElement.nativeElement;
    audio.play();
    this.isPlaying = true;
    this.audioControlService.setActivePlayer(this.playerId); // Устанавливаем текущий плеер как активный
  }

  pause() {
    const audio = this.audioElement.nativeElement;
    audio.pause();
    this.isPlaying = false;
  }

  onTimeUpdate() {
    this.currentTime = this.audioElement.nativeElement.currentTime;
    // Обновляем значение --value для прогресса
    if (this.progressInput) {
      this.progressInput.nativeElement.style.setProperty('--value', this.currentTime.toString());
      this.progressInput.nativeElement.style.setProperty('--max', this.duration.toString());
    }
  }

  onLoadedMetadata() {
    this.duration = this.audioElement.nativeElement.duration;
  }

  seek(event: Event) {
    const target = event.target as HTMLInputElement;
    const newTime = +target.value;
    this.audioElement.nativeElement.currentTime = newTime;
    this.currentTime = newTime;
  }

  toggleMute() {
    const audio = this.audioElement.nativeElement;
    audio.muted = !audio.muted;
    this.isMuted = audio.muted;
  }
}
