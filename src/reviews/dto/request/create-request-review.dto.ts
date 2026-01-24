import { Expose } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from "class-validator";


export class CreateRequestReviewDto {

    @IsNumber()
    @IsInt()
    @Min(0)
    ratings:number;

    @IsNotEmpty({message : 'Comments should not be empty.'})
    @IsString()
    comment : string;

    @IsNumber()
    @IsPositive({message : 'userId should be positive'})
    product : number;
    

}
