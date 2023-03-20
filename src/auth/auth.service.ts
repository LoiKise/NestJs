import { UserRepository } from './user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(signUp: CreateUserDto): Promise<void> {
    return this.userRepository.signUp(signUp);
  }

  async signIn(signIn: CreateUserDto): Promise<{ acessToken: string }> {
    const { userName, passWord } = signIn;
    const user = await this.userRepository.findOne({ where: { userName } });

    if (user && (await bcrypt.compare(passWord, user.passWord))) {
      const payload: JwtPayload = { userName };
      const acessToken: string = await this.jwtService.sign(payload);
      return { acessToken };
    } else {
      throw new UnauthorizedException('Please check ');
    }
  }
}
