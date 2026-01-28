import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderRequestDto } from './request/create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderRequestDto) {}
