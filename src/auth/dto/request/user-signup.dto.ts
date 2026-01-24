import {IsArray, IsEmail, IsEnum, IsNotEmpty, IsString, Min, MinLength} from 'class-validator'
import { Roles } from 'src/utils/common/user-roles.enum';


export class UserSignUpDto {

    @IsNotEmpty({message : 'Name can not be null'})
    @IsString()
    @MinLength(2)
    name : string;

    @IsNotEmpty({message : 'Email can not be null'})
    @IsEmail()
    email : string;

    @IsNotEmpty()
    @MinLength(6)
    password : string;

    @IsArray({ message: 'Roles must be an array' })
    @IsEnum(Roles, { 
      each: true, 
      message: 'Role must be admin or user' 
    })
    roles: Roles[];


}