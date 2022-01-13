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
import { PlaceOrderCommand } from './commands/impl/place-order.command';
import * as uuid from 'uuid';
import { OrderAcceptedEvent } from './events/order.events';
import {
  ClientKafka,
  EventPattern,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';

@Controller()
export class OrderController implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly eventBus: EventBus,
    private readonly commandBus: CommandBus,
    private queryBus: QueryBus,
    @Inject('NestjsKafka') private readonly client: ClientKafka,
  ) {}

  onModuleInit() {
    this.client.subscribeToResponseOf('kafka.test');
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

  @Get('kafka-test')
  testKafka() {
    return this.client.emit('kafka.test', { foo: 'bar' });
  }

  @EventPattern('kafka.test.reply')
  handleReplyFromConsumer(data: Record<string, unknown>): void {
    console.log('HELLLLLO');
    console.log(data);
  }
}
