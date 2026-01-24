import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/request/create-category-request.dto';
import { UpdateCategoryDto } from './dto/request/update-category-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CurrentUser } from 'src/utils/decorators/current-user.decorators';
import { User } from 'src/users/entities/user.entity';
import { CategoryResponseDto } from './dto/response/category.response.dto';

@Injectable()
export class CategoriesService {

  constructor(
     @InjectRepository(Category)
     private readonly categoryRepository : Repository<Category>
  ){}

  async create(createCategoryDto: CreateCategoryDto, curretUser: User):Promise<Category> {
     const category = this.categoryRepository.create(createCategoryDto);
     category.addedBy = curretUser;
     return await this.categoryRepository.save(category);

  }

  async findAll() {
    return await this.categoryRepository.find({});
  }

  async findOne(id: number) : Promise<Category | null> {
    console.log("hello");
    return await this.categoryRepository.findOne({
      where :{id : id},
      relations : {addedBy : true}
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
      const category = await this.findOne(id);
      if(!category) throw new NotFoundException('This category not found');
      Object.assign(category,updateCategoryDto);
      return await this.categoryRepository.save(category);
  }

  remove(id: number) {
    
  }
}
