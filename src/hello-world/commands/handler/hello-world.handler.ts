import {
  CommandHandler,
  EventBus,
  EventPublisher,
  ICommandHandler,
} from '@nestjs/cqrs';
import { UserRepository } from '../../repository/user.repository';
import { HelloWorldCommand } from '../impl/hello-world.command';


@CommandHandler(HelloWorldCommand)
export class HelloWorldHandler implements ICommandHandler<HelloWorldCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly eventBus: EventBus,
    private readonly repository: UserRepository,
  ) {}

  async execute(command: HelloWorldCommand) {
    console.log('Hello world command');

    const { name } = command;
    const user = this.publisher.mergeObjectContext(
      await this.repository.findByName(name),
    );
    console.log('HELLO NAME', name);
    // this.eventBus.publish(new NameSaidEvent(name));
    user.sayHello();
    user.commit();
    return `Hello World Command dispatched`;
  }
}
