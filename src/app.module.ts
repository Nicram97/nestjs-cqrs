import { Module } from '@nestjs/common';
import { HelloWorldModule } from './hello-world/hello-world.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [HelloWorldModule, OrderModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
