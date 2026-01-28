import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
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
import { OrderStatus } from 'src/orders/enums/order-status-enum';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { title } from 'process';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class ProductsService {

 constructor(
   @InjectRepository(Product) 
   private readonly productRepository : Repository<Product>,
   private readonly categoryService : CategoriesService,
   @Inject(forwardRef(()=> OrdersService))private readonly orderService : OrdersService
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

  async findAll(paginationDto: PaginationDto): Promise<any> {
    const { 
      offset, 
      limit,
      search,
      category,
      minPrice,
      maxPrice,
      minRating,
      maxRating
    } = paginationDto;

    const queryBuilder = this.productRepository.createQueryBuilder('product');

    // 1. Configuración base y Joins
    queryBuilder
        .leftJoinAndSelect('product.category', 'category')
        .leftJoin('product.reviews', 'review')
        .addSelect([
            'COUNT(review.id) AS reviewCount',
            'AVG(review.ratings) AS avgRating',
        ])
        .groupBy('product.id')
        .addGroupBy('category.id');

    // 2. Aplicar FILTROS (Antes de ejecutar)
    if (search) {
        queryBuilder.andWhere('product.title ILIKE :title', { title: `%${search}%` });
    }

    if (category) {
        queryBuilder.andWhere('category.id = :id', { id: category });
    }

    if (minPrice) {
        queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice) {
        queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    if(minRating){
      queryBuilder.andHaving("AVG(review.ratings) >= :minRating",{minRating})
    }
    if(maxRating){
      queryBuilder.andHaving("AVG(review.ratings) <= :minRating",{maxRating})
    }


    // 3. Paginación
    queryBuilder.skip(offset).take(limit);

    // 4. EJECUCIÓN ÚNICA
    // getRawMany nos da los campos calculados + los datos del producto
    const products = await queryBuilder.getRawMany();
    
    // Si necesitas el total para el frontend:
    const totalProducts = await queryBuilder.getCount();

    return {
        products,
        totalProducts,
        limit
    };
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

  async remove(id: number) {
    const product = await this.findOne(id);
    const order = await this.orderService.findOneByProductId(id);

    if(order) throw new BadRequestException('Product is in use')
      return await this.productRepository.remove(product);
  }


  async updatedStock(id : number,stock : number, status : string) {
    let product = await this.findOne(id);
    if(status === OrderStatus.DELIVERED){
      product.stock -=stock;
    }else{
      product.stock += stock;
    }
    product = await this.productRepository.save(product);
    return product;
  }
}
