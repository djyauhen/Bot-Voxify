import {Component, ElementRef, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {NgxMaskDirective} from "ngx-mask";
import {NgForOf, NgOptimizedImage} from "@angular/common";
import {AudioPlayerComponent} from "../../shared/components/audio-player/audio-player.component";
import {BotItemsService} from "../../shared/services/bot-items.service";
import {BotItemType} from "../../../../types/bot-item.type";
import {CarouselComponent, CarouselModule, OwlOptions, SlidesOutputData} from "ngx-owl-carousel-o";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    NgxMaskDirective,
    NgOptimizedImage,
    NgForOf,
    AudioPlayerComponent,
    CarouselModule,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})

export class MainComponent {
  @ViewChild('owlCarCard') owlCarCard!: CarouselComponent;
  @ViewChildren('categoryBtn') categoryButtons!: QueryList<ElementRef>;

  advantages = [
    {
      image: 'clock.png',
      description: `Не могу опоздать, <br>заболеть или забыть`
    },
    {
      image: 'voice.png',
      description: `Всегда на работе <br>и не нуждаюсь в отдыхе`
    },
    {
      image: 'speed.png',
      description: `Работаю в 100 раз <br>быстрее человека`
    },
    {
      image: 'money.png',
      description: `В 5 раз дешевле <br>оператора`
    },
    {
      image: 'list.png',
      description: `Сразу составлю <br>отчет о своей работе`
    },
    {
      image: 'task-list.png',
      description: `Строго следую <br>сценарию`
    },
    {
      image: 'msg-error.png',
      description: `Не боюсь отказов <br>и грубости`
    },
    {
      image: 'smile.png',
      description: `Всегда вежлив <br>и доброжелателен`
    },
  ]

  botItems: BotItemType[] = [];
  customOptions: OwlOptions = {
    startPosition: 0,
    autoHeight: false,
    nav:false,
    dots: false,
    mouseDrag: true,
    touchDrag: true,
    margin: 10,
    responsive: {
      0: {
        items: 1,       // 1 слайд на экранах < 692px
      },
      768: {
        items: 3,       // 3 слайда на экранах >= 692px
      }
    }
  };

  activeIndex = 0;

  constructor(private readonly titleService: Title,
              private readonly botItemsService: BotItemsService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Voxify'); // Устанавливаем заголовок

    this.botItemsService.getBotItems()
      .subscribe({
        next: (data) => {
          this.botItems = data as BotItemType[];
        },
        error: err => {
          console.log('Что-то не так')
        }
      })
  }

  ngAfterViewInit() {
    // Устанавливаем первый слайд и активную кнопку при инициализации
    this.owlCarCard.to('slide-0');
    // Класс 'active' уже будет добавлен через привязку [class.active]
  }

  selectCategory(index: number) {
    this.activeIndex = index; // Обновляем активный индекс
    const targetSlideId = `slide-${index}`;
    this.owlCarCard.to(targetSlideId); // Переходим к выбранному слайду
  }

  onSlideTranslated(event: SlidesOutputData) {
    this.activeIndex = event.startPosition ?? 0; // Синхронизируем активный индекс
  }
}
