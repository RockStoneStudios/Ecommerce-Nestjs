import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {  CreateRequestReviewDto } from './dto/request/create-request-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { UsersService } from 'src/users/users.service';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class ReviewsService {

   constructor(
      @InjectRepository(Review)
      private readonly reviewRepository : Repository<Review>,
      private readonly productService : ProductsService
   ){}

async create(createRequestReviewDto:  CreateRequestReviewDto, currentUser :User): Promise<Review> {
    const product = await this.productService.findOne(createRequestReviewDto.product);
    let review = await this.findOneByUserAndProduct(currentUser.id,product.id);
    if(review) {
       review.ratings = createRequestReviewDto.ratings;
       review.comment = createRequestReviewDto.comment;
       return await this.reviewRepository.save(review);
    }

    const {product : _ , ...restData} = createRequestReviewDto;
    review = this.reviewRepository.create(restData);
    review.product = product;
    review.user = currentUser;
    return await this.reviewRepository.save(review);
    
      
}

  async  findAll() {
     return this.reviewRepository.find({});
  }

  async findAllByProduct(productId : number) : Promise<Review[]> {
    const product = await this.productService.findOne(productId);
    return await this.reviewRepository.find(
      {where : {product : {id : productId}},
       relations : {
         user : true,
         product : {
          category : true
         }
       }
      },
      
    
    );
     
  }

  async findOne(id: number) {
    const review = await this.reviewRepository.findOne({
       where : {id},
      relations :{
         product : true,
         user : true
      },
      select : {
         product : {
           id : true,
           title : true,
           description : true
         },
         user : {
           id : true,
           name : true
         }
      }
       
    });
    if(!review) throw new NotFoundException('No se encontro un review con ese id');
    return review;
  }

 async update(id: number, updateReviewDto: UpdateReviewDto) {
    const review = await this.findOne(id);
    if(updateReviewDto.product){}
  }

  async remove(id: number) {
    const review = await this.findOne(id);
    return await this.reviewRepository.remove(review);
  }

  private async findOneByUserAndProduct(userId : number,productId: number){
    return await this.reviewRepository.findOne({
       where : {
         user : {
           id : userId
         },
         product : {
           id : productId
         }
       },
       relations : {
         user: true,
         product : {
           category : true
         }
       }
    })
  }
}
