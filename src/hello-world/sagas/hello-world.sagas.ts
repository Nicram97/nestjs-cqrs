import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { delay, map, Observable } from 'rxjs';
import { NameSaidEvent } from '../events/name-said.event';

@Injectable()
export class HelloWorldSagas {
  @Saga()
  dragonKilled = (events$: Observable<any>): Observable<void> => {
    return events$.pipe(
      ofType(NameSaidEvent),
      delay(1000),
      map((event) => {
        console.log('Hello from saga: ', event.name);
      }),
    );
  };
}
