import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Awesome T-Shirt' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 99.99 })
  @IsNumber(
    {},
    { message: 'Price must be a number with up to 2 decimal places' },
  )
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: 'High-quality cotton t-shirt', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'Clothes' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    example: ['https://placeimg.com/640/480/any'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}
