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
  Client,
  ClientKafka,
  ClientProxy,
  Ctx,
  EventPattern,
  KafkaContext,
  MessagePattern,
  Payload,
  Transport,
} from '@nestjs/microservices';
import { KafkaMessage } from 'kafkajs';

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
  }

  async onModuleDestroy() {
    // await this.client.close();
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
    return this.client.send('kafka.test', { foo: 'bar' });
  }

  @MessagePattern('kafka.test.reply')
  handleReplyFromConsumer(
    @Payload() message: any,
    @Ctx() context: KafkaContext,
  ): void {
    const originalMessage: KafkaMessage = context.getMessage();
    const value = JSON.parse(JSON.stringify(originalMessage.value));
    const response =
      `Receiving a new message from topic: kafka.test: ` +
      JSON.stringify(originalMessage.value);
    console.log(response);
  }
}
