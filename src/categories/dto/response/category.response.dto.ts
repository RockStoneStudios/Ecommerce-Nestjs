
import {Exclude, Expose, Type} from 'class-transformer'
import { UserSignUpDto } from 'src/auth/dto/request/user-signup.dto';
import { UserResponseDto } from 'src/auth/dto/response/userResponse.dto';
import { User } from 'src/users/entities/user.entity';

export class CategoryResponseDto {

    @Expose()
    id : number;

    @Expose()
    title: string;
    @Expose()
    description: string;
  
    createdAt : Date;

    updatedAt:Date;

    @Expose()
    @Type(() => UserResponseDto)
    addedBy : UserResponseDto;
}