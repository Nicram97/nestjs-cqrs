import { AggregateRoot } from '@nestjs/cqrs';
import { NameSaidEvent } from '../events/name-said.event';

export class User extends AggregateRoot {
  constructor(private name: string) {
    super();
  }

  sayHello() {
    this.apply(new NameSaidEvent(this.name));
  }
}
