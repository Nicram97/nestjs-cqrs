import { Controller, Param, Post } from '@nestjs/common';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import { PlaceOrderCommand } from './commands/impl/place-order.command';
import * as uuid from 'uuid';
import { OrderAcceptedEvent } from './events/order.events';

@Controller('order')
export class OrderController {
  constructor(
    private readonly eventBus: EventBus,
    private readonly commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  // will hardcode some values of what is going to be bought
  @Post(':name')
  async order(@Param('name') name: string): Promise<{ status: string }> {
    const orderTransactionGUID = uuid.v4();
    this.eventBus.publish(
      new OrderAcceptedEvent(orderTransactionGUID, name, 'MacBook Pro', 1),
    );
    return { status: 'ORDER_ACCEPTED' };
  }
}
