import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';

// _data: khai báo biến data nhưng k đc sử dụng dùng dấu _ để loại bỏ lỗi khai báo biến mà k sử dụng
export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
