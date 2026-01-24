import { PartialType } from '@nestjs/mapped-types';
import { CreateRequestReviewDto } from './request/create-request-review.dto';

export class UpdateReviewDto extends PartialType(CreateRequestReviewDto) {}
