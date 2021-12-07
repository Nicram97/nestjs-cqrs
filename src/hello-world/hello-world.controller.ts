import { Controller, Param, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { HelloWorldCommand } from './commands/impl/hello-world.command';

@Controller('hello-world')
export class HelloWorldController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post(':name')
  sayHello(@Param('name') name: string) {
    return this.commandBus.execute(new HelloWorldCommand(name));
  }
}
