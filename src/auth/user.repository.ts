import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { Repository, DataSource, QueryFailedError } from 'typeorm';
import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  async signUp(signUp: CreateUserDto): Promise<void> {
    const { userName, passWord } = signUp;

    // mã hoá password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(passWord, salt);

    const user = this.create({ userName, passWord: hashedPassword });
    try {
      await this.save(user, { reload: true });
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('userName  already existis');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
