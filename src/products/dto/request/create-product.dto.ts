import { Expose } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from "class-validator";

export class CreateProductDto {

    @IsNotEmpty({message : 'title cannot be blank'})
    @IsString()
    title :string;


    @IsNotEmpty({message : 'descrition cannot be empty'})
    @IsString()
    description : string;

    @IsNotEmpty({message : 'price should not be empty'})
    @IsNumber({maxDecimalPlaces: 2},{message : 'price should be number & max decimal precission 2'})
    @IsPositive({message : 'price should be great 0'})
    price : number;


    @IsNotEmpty({message : 'stock should not be empty'})
    @IsNumber()
    @Min(0,{message : 'stock cannot be negative'})
    stock : number;


    @IsNotEmpty({message : 'image should be not be empty'})
    @IsArray({message : 'images should be in array format'})
    images : string[];

    @IsNotEmpty({message : 'category should be no empty'})
    @IsNumber({},{message : 'category ud should be a number'})
    category : number;
}
