import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private readonly repo: Repository<User> ) {
  }

  async create(email, password) {
    const user = this.repo.create({email, password});
    return await this.repo.save(user);
  }

  async findOne(id: number) {
    if (!id) {
      return null;
    }
    return await this.repo.findOneBy({id})
  }

  async find(email: string) {
    return await this.repo.find({where: {email}})
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    Object.assign(user, attrs);
    return await this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return await this.repo.remove(user);
  }
}
