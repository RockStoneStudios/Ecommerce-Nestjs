import { ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserSignUpDto } from '../auth/dto/request/user-signup.dto';
import { CreateUserDto } from '../auth/dto/request/create-user.dto';
import { UpdateUserDto } from '../auth/dto/request/update-user.dto';
import {  UserResponseDto } from '../auth/dto/response/userResponse.dto';
import { UserSignInDto } from '../auth/dto/request/user-signin.dto';


@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository : Repository<User>
  ){}

 

  // Este método reemplaza tu .save()
  async create(data: Partial<User>) {
    const newUser = this.userRepository.create(data);
    return await this.userRepository.save(newUser);
  }
  async findAll() : Promise<UserResponseDto[]> {
    return await this.userRepository.find({select : ['name', 'email', 'roles']});
  }

  async findOne(id: number) : Promise<UserResponseDto> {
 
        const user = await this.userRepository.findOne({where : {id : id}});
        if(!user) throw new NotFoundException(`No se encontro usuario con id : ${id} `);
        
        return this.toUserResponse(user) ;
        
    
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

   async findUserByEmail(email : string){
    return await this.userRepository.createQueryBuilder('user')
                                    .addSelect('user.password')
                                    .where('user.email = :email',{email})
                                    .getOne()
 }


 private toUserResponse(user : User) : UserResponseDto {
    const {name,email,roles} = user;
    return { name,email,roles};
 }

 
}
