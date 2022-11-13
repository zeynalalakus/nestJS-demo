import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { UsersService } from "../users.service";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private readonly usersService: UsersService) {
  }
  async intercept(context: ExecutionContext, handler: CallHandler<any>): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const {userId} = request.session || {};
    if (userId) {
      request.currentUser = await this.usersService.findOne(userId);
    }
    return handler.handle();
  }

}
