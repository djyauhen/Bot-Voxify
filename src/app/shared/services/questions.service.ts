import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {BotItemType} from "../../../../types/bot-item.type";
import {QuestionType} from "../../../../types/question.type";
import {FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  questions = [
    {
      title: 'Для каких задач нужен бот?',
      answers: [
        `<p class="quiz-answer">Продажи <span class="quiz-subanswer">Активизация спящих клиентов, напоминание о предстоящем событии, информирование об акциях, холодные звонки</span></p>`,
        `<p class="quiz-answer">Рекрутинг / найм <span class="quiz-subanswer">Обработка входящих откликов кандидатов, исходящие звонки потенциальным кандидатам, ответы на вопросы кандидатов</span></p>`,
        `<p class="quiz-answer">Поддержка клиентов <span class="quiz-subanswer">Контроль качества, обработка входящих обращений, техническая поддержка</span></p>`,
      ],
    },
    {
      title: 'Как часто вы планируете использовать бот?',
      answers: [
        `<p class="quiz-answer">На постоянной основе, вместо оператора</p>`,
        `<p class="quiz-answer">Для конкретной задачи</p>`,
        `<p class="quiz-answer">Не знаю, хочу убедиться, что мне это подойдет</p>`,
      ]
    },
    {
      title: 'Сколько звонков в день нужно переложить на бота?',
      answers: [
        `<p class="quiz-answer">До 50 звонков</p>`,
        `<p class="quiz-answer">От 50 до 300 звонков</p>`,
        `<p class="quiz-answer">От 300 до 1000 звонков</p>`,
      ]
    },
    {
      title: 'Какую позицию вы занимаете в компании?',
      answers: [
        `<p class="quiz-answer">Директор</p>`,
        `<p class="quiz-answer">Финансовый директор</p>`,
        `<p class="quiz-answer">Собственник</p>`,
        `<p class="quiz-answer">Администратор</p>`,
        `<p class="quiz-answer">Другое</p>`,
      ]
    },
  ];

  answer: {status: boolean, message: string} = {
    status: true,
    message: 'Ответ успешно отправлен'
  };

  constructor() { }

  getQuestions(): Observable<QuestionType[]> {
    return of(this.questions);
  }
  submitResults(result: {answers: FormGroup, finalForm: FormGroup}): Observable<{status: boolean, message: string}> {
    console.log(result);
    return of(this.answer);
  }
  botRequest(result: FormGroup): Observable<{status: boolean, message: string}> {
    console.log(result);
    return of(this.answer);
  }
}
