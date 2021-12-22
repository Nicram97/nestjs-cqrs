import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { OrderCompletedEvent, OrderEventFail } from '../../events/order.events';
import { CompleteOrderCommand } from '../impl/complete-order.command';

@CommandHandler(CompleteOrderCommand)
export class CompleteOrderHandler
  implements ICommandHandler<CompleteOrderCommand>
{
  constructor(private readonly eventBus: EventBus) {}

  async execute(command: CompleteOrderCommand): Promise<{ status: string }> {
    const { orderTransactionGUID, orderUser, orderItem, orderAmount } = command;
    try {
      console.log('Order completed event emit');
      this.eventBus.publish(
        new OrderCompletedEvent(orderTransactionGUID, orderItem, orderAmount, {
          email: `${orderUser}@whatever.com`,
          id: 1,
        }),
      );
      return { status: 'COMPLETING_ORDER' };
    } catch (e) {
      this.eventBus.publish(new OrderEventFail(orderTransactionGUID, e));
    }
  }
}
