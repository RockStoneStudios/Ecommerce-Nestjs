import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category-request.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
