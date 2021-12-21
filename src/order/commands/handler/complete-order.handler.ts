import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CompleteOrderCommand } from '../impl/complete-order.command';

@CommandHandler(CompleteOrderCommand)
export class CompleteOrderHandler
  implements ICommandHandler<CompleteOrderHandler>
{
  constructor(private readonly eventBus: EventBus) {}

  execute(command: CompleteOrderHandler): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
