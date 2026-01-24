import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/request/create-category-request.dto';
import { UpdateCategoryDto } from './dto/request/update-category-request.dto';
import { CurrentUser } from 'src/utils/decorators/current-user.decorators';
import { User } from 'src/users/entities/user.entity';
import { AuthorizedGuard } from 'src/utils/guards/authorization.guard';
import { Roles } from 'src/utils/common/user-roles.enum';
import { AuthorizedRoles } from 'src/utils/decorators/authorize-roles.decorator';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';
import { CategoryResponseDto } from './dto/response/category.response.dto';
import { Serialize } from 'src/utils/common/interceptors/serialize.interceptors';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @AuthorizedRoles(Roles.ADMIN)
  @UseGuards(AuthenticationGuard,AuthorizedGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  create(@Body() createCategoryDto: CreateCategoryDto, @CurrentUser() currentUser : User) :Promise<CategoryResponseDto> {
    return this.categoriesService.create(createCategoryDto,currentUser);
  }


  @Get()
  @Serialize(CategoryResponseDto)
  findAll() : Promise<CategoryResponseDto[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @Serialize(CategoryResponseDto)
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @AuthorizedRoles(Roles.ADMIN)
  @UseGuards(AuthenticationGuard,AuthorizedGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @Serialize(CategoryResponseDto)
  remove(@Param('id') id: number) {
    return this.categoriesService.remove(+id);
  }
}
