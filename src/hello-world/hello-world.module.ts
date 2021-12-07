import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { HelloWorldHandler } from './commands/handler/hello-world.handler';
import { NameSaidEvent } from './events/name-said.event';
import { HelloWorldController } from './hello-world.controller';
import { HelloWorldSagas } from './sagas/hello-world.sagas';

@Module({
  imports: [CqrsModule],
  providers: [HelloWorldHandler, HelloWorldSagas, NameSaidEvent],
  exports: [],
  controllers: [HelloWorldController],
})
export class HelloWorldModule {}
