import { Expose, Type } from "class-transformer";
import { Product } from "src/products/entities/product.entity";
import { User } from "src/users/entities/user.entity";
import { ProductMinResponseDto } from "src/utils/common/dtos/product-min-response";
import { UserMinResponseDto } from "src/utils/common/dtos/user-min-response.dto";



export class ReviewResponseDto{

    @Expose()
    id : number;

    @Expose()
    ratings : number;

    @Expose()
    comment : string;

    @Expose()
    @Type(()=> ProductMinResponseDto)
    product : ProductMinResponseDto

    @Expose()
    @Type(()=> UserMinResponseDto)
    user : UserMinResponseDto


}