import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CheckInventoryHandler } from './commands/handler/check-inventory.handler';
import { CompleteOrderHandler } from './commands/handler/complete-order.handler';
import { CompletePaymentHandler } from './commands/handler/complete-payment.handler';
import { PlaceOrderHandler } from './commands/handler/place-order.handler';
import {
  OrderAcceptedEvent,
  OrderCompletedEvent,
  OrderEventFail,
  OrderInventoryCheckedEvent,
  OrderPaymentCompletedEvent,
  OrderPlacedEvent,
} from './events/order.events';
import { OrderController } from './order.controller';
import { OrderSagas } from './sagas/order.saga';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NestjsKafka',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'cqrs_main_producer',
            brokers: ['localhost:29092'],
          },
          consumer: {
            groupId: 'cqrs_main_producer_groupId',
          },
        },
      },
    ]),
    CqrsModule,
  ],
  providers: [
    PlaceOrderHandler,
    CheckInventoryHandler,
    CompletePaymentHandler,
    CompleteOrderHandler,
    OrderAcceptedEvent,
    OrderPlacedEvent,
    OrderInventoryCheckedEvent,
    OrderPaymentCompletedEvent,
    OrderCompletedEvent,
    OrderEventFail,
    OrderSagas,
  ],
  controllers: [OrderController],
})
export class OrderModule {}
