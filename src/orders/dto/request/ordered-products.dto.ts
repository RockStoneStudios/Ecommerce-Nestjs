import { IsInt, IsNotEmpty, IsNumber, IsPositive } from "class-validator";



export class OrderedProductsDto{

    @IsNotEmpty({message : 'Product Can not be empty'})
    id : number;

    @IsNumber({maxDecimalPlaces : 2},{message : 'Price should be a number'})
    @IsPositive({message : 'Price cannot be negative'})
    product_unit_price : number;

    @IsNumber({},{message : 'Quantity should be a number'})
    @IsInt()
    @IsPositive({message : 'Quantity cannot be negative'})
    product_quantity : number;
}