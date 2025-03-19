import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {BotItemType} from "../../../../types/bot-item.type";

@Injectable({
  providedIn: 'root'
})
export class BotItemsService {
  botItems: BotItemType[] = [
    {
      category: 'Недвижимость',
      name: 'название',
      imageSrc: 'images/house.png',
      taskCompleted: 'Повысили доходность <br> от сдачи по записи',
      trackSrc: 'audio/stal_bolshim.mp3'
    },
    {
      category: 'Автобизнес',
      name: 'название',
      imageSrc: 'images/car.png',
      taskCompleted: 'Вернули заинтересованных <br> посетителей сайта',
      trackSrc: 'audio/stal_bolshim.mp3'
    },
    {
      category: 'Доставка',
      name: 'название',
      imageSrc: 'images/deliver.png',
      taskCompleted: 'Провели опрос о качестве <br> обслуживания клиентов',
      trackSrc: 'audio/stal_bolshim.mp3'
    },
    {
      category: 'Медицина',
      name: 'название',
      imageSrc: 'images/doctor.png',
      taskCompleted: 'Повысили доходность <br> от пациентов по записи',
      trackSrc: 'audio/stal_bolshim.mp3'
    },
    {
      category: 'Финансы',
      name: 'название',
      imageSrc: 'images/money.png',
      taskCompleted: 'Повысили доходность <br> по записи',
      trackSrc: 'audio/stal_bolshim.mp3'
    },
    {
      category: 'Приглашения на мероприятия',
      name: 'название',
      imageSrc: 'images/party.png',
      taskCompleted: 'Повысили доходность <br> от сдачи по записи',
      trackSrc: 'audio/stal_bolshim.mp3'
    },
    {
      category: 'Подтверждение покупки',
      name: 'название',
      imageSrc: 'images/shop.png',
      taskCompleted: 'Повысили доходность <br> от сдачи по записи',
      trackSrc: 'audio/stal_bolshim.mp3'
    },
    {
      category: 'HR',
      name: 'название',
      imageSrc: 'images/hr.png',
      taskCompleted: 'Повысили доходность <br> от сдачи по записи',
      trackSrc: 'audio/stal_bolshim.mp3'
    },
    {
      category: 'Ритейл',
      name: 'название',
      imageSrc: 'images/retale.png',
      taskCompleted: 'Повысили доходность <br> от сдачи по записи',
      trackSrc: 'audio/stal_bolshim.mp3'
    },
    {
      category: 'Опросы и оценка качества',
      name: 'название',
      imageSrc: 'images/answers.png',
      taskCompleted: 'Повысили доходность <br> от сдачи по записи',
      trackSrc: 'audio/stal_bolshim.mp3'
    },
    {
      category: 'Прозвон по холодной базе',
      name: 'название',
      imageSrc: 'images/call.png',
      taskCompleted: 'Повысили доходность <br> от сдачи по записи',
      trackSrc: 'audio/stal_bolshim.mp3'
    },
    {
      category: 'Информирование и напоминание',
      name: 'название',
      imageSrc: 'images/info.png',
      taskCompleted: 'Повысили доходность <br> от сдачи по записи',
      trackSrc: 'audio/stal_bolshim.mp3'
    },
    {
      category: 'Образование',
      name: 'название',
      imageSrc: 'images/education.png',
      taskCompleted: 'Повысили доходность <br> от сдачи по записи',
      trackSrc: 'audio/stal_bolshim.mp3'
    },
  ]

  constructor(private readonly http: HttpClient) { }

  getBotItems(): Observable<BotItemType[]> {
    return of(this.botItems);
  }
}
