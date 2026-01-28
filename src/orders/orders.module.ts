import { forwardRef, Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrdersProducts } from './entities/orders-products.entity';
import { Shipping } from './entities/shipping.entity';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports : [TypeOrmModule.forFeature([Order,OrdersProducts,Shipping]),
  forwardRef(()=>ProductsModule)],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports : [OrdersService]
})
export class OrdersModule {}
