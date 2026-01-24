import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSignUpDto } from '../auth/dto/request/user-signup.dto';
import { CreateUserDto } from '../auth/dto/request/create-user.dto';
import { UpdateUserDto } from '../auth/dto/request/update-user.dto';
import { UserSignInDto } from '../auth/dto/request/user-signin.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthorizedGuard } from 'src/utils/guards/authorization.guard';
import { Roles } from 'src/utils/common/user-roles.enum';
import { AuthorizedRoles } from 'src/utils/decorators/authorize-roles.decorator';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


 

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return "Hi my friends";
  }

  @Get()
  @AuthorizedRoles(Roles.ADMIN)
  @UseGuards(AuthenticationGuard,AuthorizedGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
