import { Inject } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ClientKafka } from '@nestjs/microservices';
import { OrderInventoryCheckedEvent } from '../../events/order.events';
import { CheckInventoryCommand } from '../impl/check-inventory.command';

@CommandHandler(CheckInventoryCommand)
export class CheckInventoryHandler
  implements ICommandHandler<CheckInventoryCommand>
{
  constructor(
    private readonly eventBus: EventBus,
    @Inject('NestjsKafka') private readonly client: ClientKafka,
  ) {}

  async execute(command: CheckInventoryCommand): Promise<{ status: string }> {
    const { orderTransactionGUID, orderUser, orderItem, orderAmount } = command;

    console.log('Order inventory checked event emit');
    const orderInventoryCheckedEvent: OrderInventoryCheckedEvent =
      new OrderInventoryCheckedEvent(
        orderTransactionGUID,
        orderUser,
        orderItem,
        orderAmount,
      );
    // this.eventBus.publish(orderInventoryCheckedEvent);
    this.client.emit('kafka.order', JSON.stringify(orderInventoryCheckedEvent));
    return { status: 'INVENTORY_CHECK' };
  }
}
