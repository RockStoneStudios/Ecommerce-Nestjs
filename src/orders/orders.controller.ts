import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderRequestDto } from './dto/request/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';
import { CurrentUser } from 'src/utils/decorators/current-user.decorators';
import { User } from 'src/users/entities/user.entity';
import { AuthorizedGuard } from 'src/utils/guards/authorization.guard';
import { AuthorizedRoles } from 'src/utils/decorators/authorize-roles.decorator';
import { Roles } from 'src/utils/common/user-roles.enum';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';


@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthenticationGuard)
  @Post()
  async create(@Body() createOrderDto: CreateOrderRequestDto,@CurrentUser() currentUser : User) {
    return await this.ordersService.create(createOrderDto,currentUser);
  }

  @Get()
  async findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.ordersService.findOne(+id);
  }

  @AuthorizedRoles(Roles.ADMIN)
  @UseGuards(AuthenticationGuard,AuthorizedGuard)
  @Put(':id')
  async update(@Param('id') id: string,
   @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @CurrentUser() currentUser : User) {
    return await this.ordersService.update(+id, updateOrderStatusDto,currentUser);
  }


  @Put('cancel/:id')
  @UseGuards(AuthenticationGuard,AuthorizedGuard)
  @AuthorizedRoles(Roles.ADMIN)
  async cancelled(@Param('id') id : number,@CurrentUser() currentUser : User){
     return await this.ordersService.cancelled(id,currentUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
