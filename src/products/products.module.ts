import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CategoriesModule } from 'src/categories/categories.module';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports : [TypeOrmModule.forFeature([Product]),CategoriesModule,
  forwardRef(()=> OrdersModule)
],
  exports : [ProductsService],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
