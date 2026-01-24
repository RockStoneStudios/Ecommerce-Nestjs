import { Expose } from "class-transformer";



export class CategoryMinResponseDto{

    @Expose()
    id : number;

    @Expose()
    title : string;
}