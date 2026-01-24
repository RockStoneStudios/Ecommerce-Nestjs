import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ClassSerializerInterceptor } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/request/create-product.dto';
import { UpdateProductDto } from './dto/request/update-product.dto';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';
import { AuthorizedGuard } from 'src/utils/guards/authorization.guard';
import { AuthorizedRoles } from 'src/utils/decorators/authorize-roles.decorator';
import { Roles } from 'src/utils/common/user-roles.enum';
import { CurrentUser } from 'src/utils/decorators/current-user.decorators';
import { User } from 'src/users/entities/user.entity';
import { ProductResponseDto } from './dto/response/product-response.dto';
import { Serialize } from 'src/utils/common/interceptors/serialize.interceptors';
import { ProductUpdateResponseDto } from './dto/response/product-update-response.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @AuthorizedRoles(Roles.ADMIN)
  @UseGuards(AuthenticationGuard,AuthorizedGuard)
  @Post()
  async create(@Body() createProductDto: CreateProductDto, @CurrentUser() curretUser: User) {
    return await this.productsService.create(createProductDto,curretUser);
  }

  @Get()
  async findAll() {
    return await this.productsService.findAll();

  }
 
  @Serialize(ProductResponseDto)
  @Get(':id')
  async findOne(@Param('id') id: number) : Promise<ProductResponseDto> {
    return await this.productsService.findOne(id);
  }

  @AuthorizedRoles(Roles.ADMIN)
  @UseGuards(AuthenticationGuard,AuthorizedGuard)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto,
  @CurrentUser() currentUser:User
) : Promise<ProductUpdateResponseDto> {
    return await this.productsService.update(id, updateProductDto,currentUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
