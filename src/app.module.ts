import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { datasourceOptions } from 'db/datasource';
import { DataService } from 'db/db';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { OrdersModule } from './orders/orders.module';



@Module({
  imports: [
    TypeOrmModule.forRoot({autoLoadEntities : true, ...datasourceOptions}),
    UsersModule,
    AuthModule,
    CategoriesModule,
    ProductsModule,
    ReviewsModule,
    OrdersModule
  
  ],
  controllers: [],
  providers: [DataService],
})
export class AppModule {}
