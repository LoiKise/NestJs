import { CreateUserDto } from './dto/create-user.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
    return this.authService.signUp(createUserDto);
  }

  @Post('/signIn')
  signIn(@Body() signIn: CreateUserDto): Promise<{ acessToken: string }> {
    return this.authService.signIn(signIn);
  }
}
