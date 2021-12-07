import {
  CommandHandler,
  EventBus,
  EventPublisher,
  ICommandHandler,
} from '@nestjs/cqrs';
import { NameSaidEvent } from '../../events/name-said.event';
import { HelloWorldCommand } from '../impl/hello-world.command';

@CommandHandler(HelloWorldCommand)
export class HelloWorldHandler implements ICommandHandler<HelloWorldCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: HelloWorldCommand) {
    console.log('Hello world command');

    const { name } = command;

    console.log('HELLO NAME', name);
    this.eventBus.publish(new NameSaidEvent(name));
    return `Hello ${name}`;
  }
}
