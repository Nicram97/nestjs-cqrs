import {
  Controller,
  Get,
  Inject,
  OnModuleDestroy,
  OnModuleInit,
  Param,
  Post,
} from '@nestjs/common';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import * as uuid from 'uuid';
import {
  OrderAcceptedEvent,
  OrderPaymentCompletedEvent,
} from './events/order.events';
import { ClientKafka, EventPattern } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { CompleteOrderCommand } from './commands/impl/complete-order.command';

@Controller()
export class OrderController implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly eventBus: EventBus,
    private readonly commandBus: CommandBus,
    private queryBus: QueryBus, // @Inject('NestjsKafka') private readonly client: ClientKafka,
    @Inject('NestjsKafka') private readonly client: ClientKafka,
  ) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('kafka.test');
    this.client.subscribeToResponseOf('siema');
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  // will hardcode some values of what is going to be bought
  @Post(':name')
  async order(@Param('name') name: string): Promise<{ status: string }> {
    const orderTransactionGUID = uuid.v4();
    this.eventBus.publish(
      new OrderAcceptedEvent(orderTransactionGUID, name, 'MacBook Pro', 1),
    );
    return { status: 'ORDER_ACCEPTED' };
  }

  // test message-patter
  @Get('kafka-message')
  async testKafka(): Promise<any> {
    const a = await firstValueFrom(this.client.send('siema', { foo: 'bar' }));
    const b = await firstValueFrom(
      this.client.send('kafka.test', { foo: 'bar' }),
    );
    return [a, b];
  }

  // test event-patter
  @Get('kafka-event')
  async testEvent(): Promise<void> {
    this.client.emit('kafka.event', { foo: 'event' });
  }

  @EventPattern('kafka.event.response')
  readKafkaResponseEvent(data: Record<string, unknown>): void {
    console.log(`Received event from kafka.event.response topic`, data);
  }

  @EventPattern('kafka.order.response')
  parsePaymentCompleted(data: Record<string, unknown>): void {
    const orderPaymentCompletedEvent: OrderPaymentCompletedEvent = plainToClass(
      OrderPaymentCompletedEvent,
      data.value,
    );
    console.log('Payment completed proceed to complete order');
    this.commandBus.execute(
      new CompleteOrderCommand(
        orderPaymentCompletedEvent.orderTransactionGUID,
        orderPaymentCompletedEvent.orderUser,
        orderPaymentCompletedEvent.orderItem,
        orderPaymentCompletedEvent.orderAmount,
      ),
    );
  }
}
