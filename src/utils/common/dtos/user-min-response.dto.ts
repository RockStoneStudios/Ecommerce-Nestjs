import { Expose } from "class-transformer";


export class UserMinResponseDto {
    @Expose()
    id : number;

    @Expose()
    name : string;

    @Expose()
    email :string;
}