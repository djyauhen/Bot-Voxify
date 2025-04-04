import {
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {NgxMaskDirective} from "ngx-mask";
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {AudioPlayerComponent} from "../../shared/components/audio-player/audio-player.component";
import {BotItemsService} from "../../shared/services/bot-items.service";
import {BotItemType} from "../../../../types/bot-item.type";
import {CarouselComponent, CarouselModule, OwlOptions, SlidesOutputData} from "ngx-owl-carousel-o";
import {AccordionAsksComponent} from "../../shared/components/accordion-asks/accordion-asks.component";
import {QuestionType} from "../../../../types/question.type";
import {QuestionsService} from "../../shared/services/questions.service";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {
  NgxIntlTelInputModule,
  SearchCountryField,
  PhoneNumberFormat,
  NgxIntlTelInputComponent, CountryISO
} from "ngx-intl-tel-input";
import {BsDropdownModule} from "ngx-bootstrap/dropdown";

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
    ReactiveFormsModule,
    NgxIntlTelInputModule,
    BsDropdownModule,
    NgClass,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})

export class MainComponent {
  @ViewChild('owlCarCard') owlCarCard!: CarouselComponent;
  @ViewChildren('categoryBtn') categoryButtons!: QueryList<ElementRef>;

  @ViewChild('phoneInput', { static: false }) phoneInput!: NgxIntlTelInputComponent;

  phoneForm = new FormGroup({
    phone: new FormControl('')
  });
  SearchCountryField = SearchCountryField;
  PhoneNumberFormat = PhoneNumberFormat;
  phoneMask = '(000) 000-00-00'; // Стандартная маска для России
  phonePlaceholder = '+7 (___) ___-__-__';
  prefix = '+7';
  selectedCountryISO: CountryISO = CountryISO.Russia;

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
  private currentAudio: HTMLAudioElement | null = null;
  public currentPlayerId: string | null = null;
  dialogPopup: HTMLDialogElement | null = null;

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

    this.phoneForm.get('phone')?.valueChanges.subscribe(() => {
      this.updateMask();
    });
  }

  onSearchInput(event: Event) {
    setTimeout(() => {
      const searchInput = event.target as HTMLInputElement;
      const searchText = searchInput.value.toLowerCase().trim();
      // Получаем .iti__country-list через родителя .iti
      const dropdown = searchInput.closest('.iti')?.querySelector('.iti__country-list');

      if (dropdown && searchText) {
        const countries = dropdown.querySelectorAll('.iti__country') as NodeListOf<HTMLElement> & Iterable<HTMLElement>;
        let matchedCountry = null;

        // Ищем первый элемент, соответствующий запросу
        for (const country of countries) {
          const countryName = country.querySelector('.iti__country-name')?.textContent?.toLowerCase();
          const dialCode = country.querySelector('.iti__dial-code')?.textContent?.toLowerCase();
          const isoCode = country.getAttribute('data-country-code')?.toLowerCase();

          if (
            (countryName && countryName.includes(searchText)) ||
            (dialCode && dialCode.includes(searchText)) ||
            (isoCode && isoCode.includes(searchText))
          ) {
            matchedCountry = country;
            break; // Первый совпадающий элемент
          }
        }

        if (matchedCountry) {
          const offsetTop = matchedCountry.offsetTop;

          // Пробуем scrollTo
          dropdown.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }
    }, 500); // Задержка для завершения фильтрации
  }

  onCountryChange(event: any) {this.selectedCountryISO = event.iso2;
    setTimeout(() => this.updateMask(), 500);
  }

  updateMask() {
    const placeholder = this.phoneInput.selectedCountry.placeHolder || '';
    this.prefix = `+${this.phoneInput.selectedCountry.dialCode}` || '';
    const placeholderChanged = placeholder.startsWith(this.prefix) ? placeholder.replace(`${this.prefix} `, '') : placeholder;
    this.phonePlaceholder = placeholderChanged.replace(/\d/g, '*');

    // Создаем маску (заменяем все цифры на '0')
    this.phoneMask = placeholderChanged.replace(/\d/g, '0');
  }

  ngAfterViewInit() {
    setTimeout(() => this.updateMask(), 500);

    // Устанавливаем первый слайд и активную кнопку при инициализации
    this.owlCarCard.to('slide-0');

    // Устанавливаем появление Изображения
    const zoomImages = document.querySelectorAll('.zoom-in');
    this.startAnimationUp(zoomImages, 'zoom-in-active');
    // Конец появление Изображения


    // Устанавливаем появление текста под advantages
    const visibleOffItems = document.querySelectorAll('.visible-off');
    this.startAnimationUp(visibleOffItems, 'visible');
    // Конец появление текста под advantages

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
      this.finalForm.patchValue({phone: `${this.prefix}${this.finalForm.value.phone}`});
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
    } else {
      alert('Заполните поля');
    }
  }

  startAudio(audioSrc: string, playerId: string) {
    if (this.currentAudio && this.currentPlayerId !== playerId) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }

    if (this.currentAudio && this.currentPlayerId === playerId) {
      if (this.currentAudio.paused) {
        this.currentAudio.play();
      } else {
        this.currentPlayerId = null;
        this.currentAudio.pause();
      }
      return;
    }

    this.currentAudio = new Audio(audioSrc);
    this.currentAudio.play();
    this.currentPlayerId = playerId;
  }

  sendBotForm() {
    this.botForm.patchValue({phone: `${this.prefix}${this.botForm.value.phone}`});
    this.questionService.botRequest(this.botForm.value)
      .subscribe(
        (response) => {
          console.log('Results submitted:', response);
          this.botForm.reset();
          this.dialogPopup = (document.getElementById('dialog-popup') as HTMLDialogElement) ?? null;
          if (this.dialogPopup) this.dialogPopup.showModal();
        },
        (error) => {
          console.error('Error submitting results:', error);
        }
      );
  }

  closePopup() {
    if (this.dialogPopup) this.dialogPopup.close();
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

  startAnimationUp(elements: NodeList, className: string) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(className);
          observer.unobserve(entry.target); // Отключаем наблюдение после появления
        }
      });
    }, { threshold: 0.4 }); // Порог видимости (50%)

    if (elements) {
      elements.forEach(el => observer.observe((el as Element)));
    }
  }

  protected readonly String = String;

  ngOnDestroy() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }
  }
}
