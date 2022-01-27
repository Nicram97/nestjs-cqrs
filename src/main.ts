import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'cqrs_consumer',
        brokers: ['localhost:29092'],
      },
      consumer: {
        groupId: 'cqrs_consumer_groupId',
      },
    },
  });
  const port = 3001;
  await app.startAllMicroservices();
  await app.listen(port);
  console.log(`Server listening on port ${port}`);
}
bootstrap();
