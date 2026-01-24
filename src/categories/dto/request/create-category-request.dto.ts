import { IsNotEmpty, IsString } from "class-validator";



export class CreateCategoryDto {
    @IsNotEmpty({message : 'Title can not be empty'})
    @IsString({message : 'title should be string' })  
    title : string;

    @IsNotEmpty({message : 'description should be string'})
    @IsString({message : 'description should be string'})
    description : string;
}
