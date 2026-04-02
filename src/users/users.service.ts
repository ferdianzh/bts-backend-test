import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CustomSqlException } from 'src/exceptions/custom-sql.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return await user.save().catch((err) => {
      throw new CustomSqlException(err);
    });
  }

  async findOneByUsername(username: string) {
    return await this.userRepository
      .findOneOrFail({ where: { username } })
      .catch(() => {
        return null;
      });
  }
}
