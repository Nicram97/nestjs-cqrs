import { Controller, Param, Post } from '@nestjs/common';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import { PlaceOrderCommand } from './commands/impl/place-order.command';

@Controller('order')
export class OrderController {
  constructor(
    private readonly eventBus: EventBus,
    private readonly commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post(':name')
  sayHello(@Param('name') name: string) {
    return this.commandBus.execute(new PlaceOrderCommand(name));
  }
}
