import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { OrderInventoryCheckedEvent } from 'src/order/events/order.events';
import { CheckInventoryCommand } from '../impl/check-inventory.command';

@CommandHandler(CheckInventoryCommand)
export class CheckInventoryHandler
  implements ICommandHandler<CheckInventoryCommand>
{
  constructor(private readonly eventBus: EventBus) {}

  async execute(command: CheckInventoryCommand): Promise<{ status: string }> {
    const { orderTransactionGUID, orderUser, orderItem, orderAmount } = command;

    console.log('Order inventory checked event emit');
    this.eventBus.publish(
      new OrderInventoryCheckedEvent(
        orderTransactionGUID,
        orderUser,
        orderItem,
        orderAmount,
      ),
    );

    return { status: 'INVENTORY_CHECK' };
  }
}
