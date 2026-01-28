import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";




export class PaginationDto{ 

    @IsOptional()
    @IsNumber()
    offset : number = 0;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    limit : number = 2;

    @IsOptional()
    @IsString()
    search : string;


    @IsOptional()
    @IsString()
    category : string;

    @IsOptional()
    @IsNumber()
    @Min(0.1)
    minPrice : number;


    @IsOptional()
    @IsNumber()
    maxPrice : number;

    @IsOptional()
    @IsNumber()
    @Type(()=> Number)
    minRating : number;

    @IsOptional()
    @IsNumber()
    @Type(()=> Number)
    maxRating : number;
}