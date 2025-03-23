import {
  Component,
  ElementRef,
  QueryList,
  signal,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {NgxMaskDirective} from "ngx-mask";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {AudioPlayerComponent} from "../../shared/components/audio-player/audio-player.component";
import {BotItemsService} from "../../shared/services/bot-items.service";
import {BotItemType} from "../../../../types/bot-item.type";
import {CarouselComponent, CarouselModule, OwlOptions, SlidesOutputData} from "ngx-owl-carousel-o";
import {AccordionAsksComponent} from "../../shared/components/accordion-asks/accordion-asks.component";
import {QuestionType} from "../../../../types/question.type";
import {QuestionsService} from "../../shared/services/questions.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    NgxMaskDirective,
    NgOptimizedImage,
    NgForOf,
    AudioPlayerComponent,
    CarouselModule,
    AccordionAsksComponent,
    NgIf,
    ReactiveFormsModule
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
        items: 1,
      },
      688: {
        items: 3,
      }
    }
  };

  activeIndex = 0;
  questions: QuestionType[] = [];
  currentStep = 0;
  isQuizCompleted = false;
  quizForm: FormGroup;
  finalForm: FormGroup;
  botForm: FormGroup;
  showQuiz: boolean = false;

  constructor(private readonly titleService: Title,
              private readonly botItemsService: BotItemsService,
              private readonly questionService: QuestionsService,
              private fb: FormBuilder) {
    this.quizForm = this.fb.group({});
    this.finalForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      telegram: [false],
      whatsApp: [false],
      companyRole: ['', Validators.required]
    });
    this.botForm = this.fb.group({
      phone: ['', Validators.required],
    });
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

    this.questionService.getQuestions()
      .subscribe({
        next: (data) => {
          this.questions = data as QuestionType[];
          this.buildQuizForm();
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

  protected readonly Number = Number;

  buildQuizForm() {
    const controls = this.questions.reduce((acc, _, index) => {
      acc[index] = [null, Validators.required]; // Для каждого вопроса обязателен выбор
      return acc;
    }, {} as { [key: number]: any });

    this.quizForm = this.fb.group(controls);
  }

  nextStep() {
    if (this.currentStep < this.questions.length - 1) {
      this.currentStep++;
    } else {
      this.currentStep++; // Переход к финальной форме
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    } else {
      this.showQuiz = false;
    }
  }

  onSubmit() {
    if (this.quizForm.valid && this.finalForm.valid) {
      const result = {
        answers: this.quizForm.value,
        finalForm: this.finalForm.value
      };

      this.questionService.submitResults(result)
        .subscribe(
        (response) => {
          console.log('Results submitted:', response);
          this.isQuizCompleted = true;
          this.quizForm.reset();
          this.finalForm.reset();
        },
        (error) => {
          console.error('Error submitting results:', error);
        }
      );
    }
  }

  sendBotForm() {
    this.questionService.botRequest(this.botForm.value)
      .subscribe(
        (response) => {
          console.log('Results submitted:', response);
          this.botForm.reset();
        },
        (error) => {
          console.error('Error submitting results:', error);
        }
      );
  }

  goTo(id: string) {
    const item = document.getElementById(id);

    if (item) {
      let offsetTop = item.getBoundingClientRect().top + window.scrollY - 30;

      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  }

  protected readonly String = String;
}
