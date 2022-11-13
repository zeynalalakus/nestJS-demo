import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UsersService } from "../users.service";
import { User } from "../user.entity";

declare global {
  namespace Express {
    interface Request {
      currentUser?: User
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};
    if (userId) {
      req.currentUser = await this.usersService.findOne(Number(userId));
    }
    next();
  }

}
