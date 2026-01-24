import { Type } from "class-transformer";
import { CreateShippingRequestDto } from "./create-shipping.dto";
import { ValidateNested } from "class-validator";
import { OrderedProductsDto } from "./ordered-products.dto";



export class CreateOrderRequestDto {

    @Type(()=> CreateShippingRequestDto)
    @ValidateNested()
    shippingAddress: CreateShippingRequestDto;

    @Type(()=> OrderedProductsDto)
    @ValidateNested()
    orderedProducts : OrderedProductsDto[];


}