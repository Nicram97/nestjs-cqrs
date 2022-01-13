import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { delay, map, mergeMap, Observable } from 'rxjs';
import { CheckInventoryCommand } from '../commands/impl/check-inventory.command';
import { CompleteOrderCommand } from '../commands/impl/complete-order.command';
import { CompletePaymentCommand } from '../commands/impl/complete-payment.command';
import { PlaceOrderCommand } from '../commands/impl/place-order.command';
import {
  OrderAcceptedEvent,
  OrderCompletedEvent,
  OrderInventoryCheckedEvent,
  OrderPaymentCompletedEvent,
  OrderPlacedEvent,
} from '../events/order.events';

@Injectable()
export class OrderSagas {
  @Saga()
  orderAccepted = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(OrderAcceptedEvent),
      delay(1000),
      map((event) => {
        console.log('Order accepted saga');
        return new PlaceOrderCommand(
          event.orderTransactionGUID,
          event.orderUser,
          event.orderItem,
          event.orderAmount,
        );
      }),
    );
  };

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

  // @Saga()
  // orderInventoryChecked = (events$: Observable<any>): Observable<ICommand> => {
  //   return events$.pipe(
  //     ofType(OrderInventoryCheckedEvent),
  //     delay(2000),
  //     map((event) => {
  //       console.log('orderInventoryChecked saga');
  //       return new CompletePaymentCommand(
  //         event.orderTransactionGUID,
  //         event.orderUser,
  //         event.orderItem,
  //         event.orderAmount,
  //       );
  //     }),
  //   );
  // };

  // @Saga()
  // orderPaymentCompleted = (events$: Observable<any>): Observable<ICommand> => {
  //   return events$.pipe(
  //     ofType(OrderPaymentCompletedEvent),
  //     delay(5000),
  //     map((event) => {
  //       console.log('orderPaymentCompleted saga');
  //       return new CompleteOrderCommand(
  //         event.orderTransactionGUID,
  //         event.orderUser,
  //         event.orderItem,
  //         event.orderAmount,
  //       );
  //     }),
  //   );
  // };

  // @Saga()
  // orderCompleted = (events$: Observable<any>): Observable<ICommand> => {
  //   return events$.pipe(
  //     ofType(OrderCompletedEvent),
  //     delay(1000),
  //     mergeMap((event) => {
  //       console.log('OrderCompleted saga', event.user.email);
  //       return [];
  //     }),
  //   );
  // };
}
