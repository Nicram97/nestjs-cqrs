import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { delay, map, Observable } from 'rxjs';
import { CheckInventoryCommand } from '../commands/impl/check-inventory.command';
import { CompletePaymentCommand } from '../commands/impl/complete-payment.command';
import {
  OrderInventoryCheckedEvent,
  OrderPaymentCompletedEvent,
  OrderPlacedEvent,
} from '../events/order.events';

@Injectable()
export class OrderSagas {
  @Saga()
  orderPlaced = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(OrderPlacedEvent),
      delay(1000),
      map((event) => {
        console.log('Order placed saga');
        return new CheckInventoryCommand(
          event.orderTransactionGUID,
          event.orderUser,
          event.orderItem,
          event.orderAmount,
        );
      }),
    );
  };

  @Saga()
  orderInventoryChecked = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(OrderInventoryCheckedEvent),
      delay(2000),
      map((event) => {
        console.log('orderInventoryChecked saga');
        return new CompletePaymentCommand(
          event.orderTransactionGUID,
          event.orderUser,
          event.orderItem,
          event.orderAmount,
        );
      }),
    );
  };

  @Saga()
  orderPaymentCompleted = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(OrderPaymentCompletedEvent),
      delay(1000),
      map((event) => {
        console.log('orderPaymentCompleted saga');
        return '';
      }),
    );
  };
}
