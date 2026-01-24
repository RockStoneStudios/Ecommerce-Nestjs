import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateProductDto } from './dto/request/create-product.dto';
import { UpdateProductDto } from './dto/request/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { User } from 'src/users/entities/user.entity';
import { AuthorizedGuard } from 'src/utils/guards/authorization.guard';
import { AuthorizedRoles } from 'src/utils/decorators/authorize-roles.decorator';
import { Roles } from 'src/utils/common/user-roles.enum';

@Injectable()
export class ProductsService {

 constructor(
   @InjectRepository(Product) 
   private readonly productRepository : Repository<Product>,
   private readonly categoryService : CategoriesService
 ){}

  async create(createProductDto: CreateProductDto, currentUser : User) : Promise<Product> {
    const category = await this.categoryService.findOne(createProductDto.category);
    if(!category) throw new NotFoundException('No existe esa categoria');
    const {category :_, ...restData} = createProductDto;
    const product = this.productRepository.create(restData);
    product.category = category;
    product.addedBy = currentUser;
    return this.productRepository.save(product);
  }

  async findAll() : Promise<Product[]> {
    return await this.productRepository.find({});
  }

  async findOne(id: number) {
      const product =  await this.productRepository.findOne({
         where : {id},
         relations : {
            addedBy : true,
            category : true
         },
         select : {
           addedBy : {
              id : true,
              name : true,
              email : true
           },
           category : {
             id : true,
             title : true
           }
         }
      });
      if(!product) throw new NotFoundException('No se encontro producto por este Id');
      return product;
  }

 
 async  update(id: number, updateProductDto: UpdateProductDto,currentUser: User) : Promise<Product> {
     const product = await this.findOne(id);
     if(updateProductDto.category){
        // busco si la categoria existe 
        const category = await this.categoryService.findOne(updateProductDto.category);
        if(!category) throw new NotFoundException('Categoria no existe');
        product.category = category;
     }
     product.addedBy = currentUser;
     return await this.productRepository.save(product);
   
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
