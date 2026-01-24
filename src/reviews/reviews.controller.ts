import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateRequestReviewDto } from './dto/request/create-request-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';
import { AuthorizedGuard } from 'src/utils/guards/authorization.guard';
import { AuthorizedRoles } from 'src/utils/decorators/authorize-roles.decorator';
import { Roles } from 'src/utils/common/user-roles.enum';
import { CurrentUser } from 'src/utils/decorators/current-user.decorators';
import { User } from 'src/users/entities/user.entity';
import { ReviewResponseDto } from './dto/response/review-response.dto';
import { Serialize } from 'src/utils/common/interceptors/serialize.interceptors';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Serialize(ReviewResponseDto)
  @AuthorizedRoles(Roles.ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizedGuard)
  @Post()
 async create(@Body() createReviewDto:  CreateRequestReviewDto, @CurrentUser() currentUser: User):Promise<ReviewResponseDto> {
    return await  this.reviewsService.create(createReviewDto,currentUser);
  }

  @Get("/all")
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get("")
  async findAllByProduct(@Body() productId : number){
     return await this.findAllByProduct(productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(+id, updateReviewDto);
  }

  @AuthorizedRoles(Roles.ADMIN)
  @UseGuards(AuthenticationGuard,AuthorizedGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }
}
