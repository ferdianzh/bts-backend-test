import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ILike, Repository } from 'typeorm';
import { CustomSqlException } from 'src/exceptions/custom-sql.exception';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    return product.save().catch((err) => {
      throw new CustomSqlException(err);
    });
  }

  async findAll({
    search,
    category,
    limit,
    page,
  }: {
    search?: string;
    category?: string;
    limit?: number;
    page?: number;
  }) {
    const [data, count] = await this.productRepository.findAndCount({
      where: {
        title: ILike(`%${search ?? ''}%`),
        category,
      },
      skip: page && limit ? (page - 1) * limit : undefined,
      take: limit,
    });
    return { data, count };
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('product not found');
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    const saved = await product.save().catch((err) => {
      throw new CustomSqlException(err);
    });

    if (!saved) {
      throw new NotFoundException('product not found');
    }
    return saved;
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException('product not found');
    }

    await product.remove();
  }
}
