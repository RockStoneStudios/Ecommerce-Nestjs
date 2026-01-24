import { Expose } from "class-transformer";



export class ProductMinResponseDto {
     
    @Expose()
    id: number;

    @Expose()
    title : string;

    @Expose()
    description : string;
}