import { Expose, Type } from "class-transformer";
import { UserResponseDto } from "src/auth/dto/response/userResponse.dto";
import { CategoryMinResponseDto } from "src/utils/common/dtos/category-min-response.dto";
import { UserMinResponseDto } from "src/utils/common/dtos/user-min-response.dto";




export class ProductResponseDto {

    @Expose()
    id : number;

    @Expose()
    title : string;

    @Expose()
    description : string;

    @Expose()
    price : number;

    @Expose()
    stock : number;

    @Expose()
    images : string[]


    @Expose()
    @Type(()=> UserResponseDto)
    addedBy: UserMinResponseDto

    @Expose()
    @Type(()=> CategoryMinResponseDto)
    category : CategoryMinResponseDto;
    
}