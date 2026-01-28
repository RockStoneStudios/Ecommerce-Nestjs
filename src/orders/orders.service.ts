import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrdersProducts } from './entities/orders-products.entity';
import { Shipping } from './entities/shipping.entity';
import { CreateOrderRequestDto } from './dto/request/create-order.dto';
import { IOrderProduct } from 'src/utils/interfaces/IOrderProduct';
import { ProductsService } from 'src/products/products.service';
import { Product } from 'src/products/entities/product.entity';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from './enums/order-status-enum';

@Injectable()
export class OrdersService {


   constructor(
      @InjectRepository(Order) 
      private readonly orderRepository : Repository<Order>,
      @InjectRepository(OrdersProducts) 
      private readonly ordersProductRepository : Repository<OrdersProducts>,
     @Inject(forwardRef(()=> ProductsService)) private readonly productService : ProductsService
      

   ){}

async create(createOrderDto: CreateOrderRequestDto, currentUser: User) {
    const shipping = new Shipping();
    Object.assign(shipping,createOrderDto.shippingAddress);

    const order = new Order();
    order.shippingAddress = shipping;
    order.user = currentUser;

    const orderSave = await this.orderRepository.save(order);

    let orderProducts : IOrderProduct[] = [];

    for(let i = 0; i< createOrderDto.orderedProducts.length; i++){
        const order = orderSave;
        const product = {id : createOrderDto.orderedProducts[i].id} as Product;
        const product_quantity = createOrderDto.orderedProducts[i].product_quantity;
        const product_unit_price = createOrderDto.orderedProducts[i].product_unit_price;

        orderProducts.push({order,product,product_quantity,product_unit_price});
    }
 
     // Insercion Masiva (Bulk Insert)
     await this.orderRepository.createQueryBuilder()
        .insert()
        .into(OrdersProducts)
        .values(orderProducts)
        .execute();

        return await this.findOne(orderSave.id);

}  


  async findAll() {
      return await this.orderRepository.find({
         relations : {
           shippingAddress : true,
           user : true,
           products : {product : true}
         }
      })
  }

  async findOne(id: number) {
     const order =  await this.orderRepository.findOne({
       where :{id},
       relations : {
         shippingAddress : true,
         user: true,
         products : {product : true}
       }
    });
     if(!order) throw new NotFoundException('No se encotro order con este id');
     return order;
  }

 async update(id: number, updateOrderStatusDto: UpdateOrderStatusDto, currentUser : User) {
    // 1. Recuperamos la orden actual con sus relaciones (importante para el stock después)
    let order = await this.findOne(id);
    // 3. VALIDACIÓN: Estados finales (Terminal States)
    // Si una orden ya se entregó o se canceló, no se puede volver a modificar su estado.
    if((order.status === OrderStatus.DELIVERED) || (order.status === OrderStatus.CANCELLED)){
       throw new BadRequestException(`No se puede modificar una orden que ya está ${order.status}`)
       
       // 2. VALIDACIÓN: Evitar saltos de estado ilógicos
       // Si la orden está en preparación (PROCESSING), no debería marcarse como enviada (SHIPPED) 
       // sin pasar por los filtros previos (aunque aquí parece que lanzas error si intentas enviarla).
    } 
    if((order.status === OrderStatus.PROCESSING) && (updateOrderStatusDto.status != OrderStatus.SHIPPED)){
       throw new BadRequestException(`Entrega antes del envío: ${order.status}`)
    } 


    // 4. OPTIMIZACIÓN: Si el estado nuevo es igual al actual, no hacemos nada y retornamos.
    if((updateOrderStatusDto.status === OrderStatus.SHIPPED) && (order.status === OrderStatus.SHIPPED)){
       return order;
    } 

    // 5. REGISTRO DE FECHAS (Timestamps de negocio)
    // Si el nuevo estado es "Enviado", guardamos el momento exacto.
    if(updateOrderStatusDto.status === OrderStatus.SHIPPED){
       order.shippedAt = new Date();
    }

    // Si el nuevo estado es "Entregado", guardamos la fecha de recepción.
    if(updateOrderStatusDto.status === OrderStatus.DELIVERED){
       order.deliveredAt = new Date();
    }

    // 6. ACTUALIZACIÓN DE DATOS
    order.status = updateOrderStatusDto.status; // Cambiamos el estado
    order.updatedBy = currentUser;              // Guardamos quién hizo el cambio (Auditoría)
    
    // 7. PERSISTENCIA: Guardamos los cambios en la base de datos
    order = await this.orderRepository.save(order);

    // 8. ACCIÓN SECUNDARIA: Actualización de Inventario
    // Solo si la orden se entrega, procedemos a descontar/actualizar el stock de los productos.
    if(updateOrderStatusDto.status === OrderStatus.DELIVERED){
       // Es vital que 'order' tenga cargada la relación de productos aquí
       await this.stockUpdate(order, OrderStatus.DELIVERED);
    }

    return order;
}


  async cancelled(id : number, currentUser : User){
     let order = await this.findOne(id);
     
     if(order.status === OrderStatus.CANCELLED) return order;

     order.status = OrderStatus.CANCELLED;
     order.updatedBy = currentUser;
     order = await this.orderRepository.save(order);
     await this.stockUpdate(order,OrderStatus.CANCELLED);
     return order;
  }


  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  private async stockUpdate(order: Order, status : string) {
      for(const orderProduct of order.products) {
         await this.productService.updatedStock(orderProduct.product.id , orderProduct.product_quantity,status);

      }
  }


  async findOneByProductId(id : number) {
    return await this.ordersProductRepository.findOne({
      where : {product : {id : id}},
      relations : {
         product : true
      }
    })
  }
}
