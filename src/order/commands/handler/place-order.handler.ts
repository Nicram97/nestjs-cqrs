import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { PlaceOrderCommand } from '../impl/place-order.command';
import { OrderPlacedEvent } from '../../events/order.events';

@CommandHandler(PlaceOrderCommand)
export class PlaceOrderHandler implements ICommandHandler<PlaceOrderCommand> {
  constructor(private readonly eventBus: EventBus) {}

  async execute(command: PlaceOrderCommand): Promise<{ status: string }> {
    const { orderTransactionGUID, orderUser, orderItem, orderAmount } = command;
    console.log('Order placed event emit');
    this.eventBus.publish(
      new OrderPlacedEvent(
        orderTransactionGUID,
        orderUser,
        orderItem,
        orderAmount,
      ),
    );

    return { status: 'ORDER_PLACED' };
  }
}
