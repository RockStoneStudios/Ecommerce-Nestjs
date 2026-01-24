import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrdersProducts } from './entities/orders-products.entity';
import { Shipping } from './entities/shipping.entity';
import { CreateOrderRequestDto } from './dto/request/create-order.dto';
import { IOrderProduct } from 'src/utils/interfaces/IOrderProduct';

@Injectable()
export class OrdersService {


   constructor(
      @InjectRepository(Order) 
      private readonly orderRepository : Repository<Order>,
      @InjectRepository(OrdersProducts) 
      private readonly ordersProductRepository : Repository<OrdersProducts>
      

   ){}

async create(createOrderDto: CreateOrderRequestDto, currentUser: User) {
    const shipping = new Shipping();
    Object.assign(Shipping,createOrderDto.shippingAddress);

    const order = new Order();
    order.shippingAddress = shipping;
    order.user = currentUser;

    const orderSave = this.orderRepository.create(order);

    let orderProducts : IOrderProduct[] = [];

    for(let i= 0; i<createOrderDto.orderedProducts.length;i++){
       const orderId = orderSave.id;
       const productId = createOrderDto.orderedProducts[i].id;
       const product_quantity = createOrderDto.orderedProducts[i].product_quantity;
       const product_unit_price = createOrderDto.orderedProducts[i].product_unit_price;
       orderProducts.push({orderId,productId,product_quantity,product_unit_price});

    }

     // Insercion Masiva (Bulk Insert) 
     await this.orderRepository.createQueryBuilder()
           .insert()
           .into(OrdersProducts)
           .values(orderProducts)
           .execute();

      return await this.findOne(order.id);     
}  


  async findAll() {
    
  }

  async findOne(id: number) {
     return await this.orderRepository.findOne({
       where :{id},
       relations : {
         shippingAddress : true,
         user: true,
         products : {product : true}
       }
    })
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
