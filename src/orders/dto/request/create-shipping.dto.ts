import { IsNotEmpty, IsOptional, IsString } from "class-validator";



export class CreateShippingRequestDto {

    @IsNotEmpty({message : 'Phone Can not be empty'})
    @IsString({message : 'Phone format should be string'})
    phone : string;
 
    @IsOptional()
    @IsNotEmpty({message : 'Name Can not be empty'})
    name : string;
  
    @IsNotEmpty({message : 'Address Can not be empty'})
    @IsString({message : 'Address format should be string'})
    address : string;

    @IsNotEmpty({message : 'City Can not be empty'})
    @IsString({message : 'City format should be string'})
    city : string;

    @IsNotEmpty({message : 'PostCodeCan not be empty'})
    @IsString({message : 'PostCode format should be string'})
    postCode : string;

    @IsNotEmpty({message : 'State Can not be empty'})
    @IsString({message : 'State format should be string'})
    state : string;

    @IsNotEmpty({message : 'Country Can not be empty'})
    @IsString({message : 'Country format should be string'})
    country : string;
}