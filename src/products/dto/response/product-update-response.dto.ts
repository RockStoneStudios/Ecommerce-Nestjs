import { PartialType } from "@nestjs/mapped-types";
import { ProductResponseDto } from "./product-response.dto";



export class ProductUpdateResponseDto extends PartialType(ProductResponseDto){}