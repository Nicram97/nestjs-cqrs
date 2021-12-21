import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { PlaceOrderCommand } from '../impl/place-order.command';
import * as uuid from 'uuid';
import { OrderPlacedEvent } from 'src/order/events/order.events';

@CommandHandler(PlaceOrderCommand)
export class PlaceOrderHandler implements ICommandHandler<PlaceOrderCommand> {
  constructor(private readonly eventBus: EventBus) {}

  // will hardcode some values of what is going to be bought
  async execute(command: PlaceOrderCommand): Promise<{ status: string }> {
    const { name } = command;
    const orderTransactionGUID = uuid.v4();

    console.log('Order placed event emit');
    this.eventBus.publish(
      new OrderPlacedEvent(orderTransactionGUID, name, 'MacBook Pro', 1),
    );

    return { status: 'ORDER_PLACED' };
  }
}
