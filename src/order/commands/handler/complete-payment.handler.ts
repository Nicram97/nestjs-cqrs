import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { OrderPaymentCompletedEvent } from '../../events/order.events';
import { CompletePaymentCommand } from '../impl/complete-payment.command';

@CommandHandler(CompletePaymentCommand)
export class CompletePaymentHandler
  implements ICommandHandler<CompletePaymentCommand>
{
  constructor(private readonly eventBus: EventBus) {}

  async execute(command: CompletePaymentCommand): Promise<{ status: string }> {
    const { orderTransactionGUID, orderUser, orderItem, orderAmount } = command;

    console.log('Order payment completed event emit');
    this.eventBus.publish(
      new OrderPaymentCompletedEvent(
        orderTransactionGUID,
        orderUser,
        orderItem,
        orderAmount,
      ),
    );

    return { status: 'CHECKING_ORDER_PAYMENT' };
  }
}
