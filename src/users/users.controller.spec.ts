import { UsersController } from "./users.controller";
import { Test, TestingModule } from "@nestjs/testing";
import { User } from "./user.entity";
import { UsersService } from "./users.service";
import { AuthService } from "./auth.service";
import { NotFoundException } from "@nestjs/common";
import exp from "constants";

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {return Promise.resolve({id, email: 'test@mail.com', password: 'test'} as User)},
      find: (email: string) => {return Promise.resolve([{id: 1, email, password:'test'} as User])},
      remove: (id: number) => {return Promise.resolve({id, email: 'test@mail.com', password: 'test'} as User)},
      update: (id: number, attrs: Partial<User>) => {return Promise.resolve({id, email: 'test@mail.com', password: 'test', ...attrs} as User)}
    }
    fakeAuthService = {
      signup: (email, password) => {return Promise.resolve({id: 1, email, password} as User)},
      signin: (email, password) => {return Promise.resolve({id: 1, email, password} as User)}
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {provide: AuthService, useValue: fakeAuthService},
        {provide: UsersService, useValue: fakeUsersService}
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("findAllUsers returns a list of users with the given email", async () => {
    const users = await controller.findAllUsers('test@email.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@email.com');
  });

  it("findUser returns a single user with the given id", async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it("signIn updates session object and returns user", async () => {
    const session = {userId: -1};
    const user = await controller.signin({email: 'test@mail.com', password: 'test'}, session);
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });

  it("who function returns a user", async () => {
    const user = await controller.who({id: 1, email: 'test@mail.com', password:'test'} as User);
    expect(user).toBeDefined();
  });

  it("signs out a user", async () => {
    const session = {userId: 1};
    await controller.signOut(session);
    expect(session.userId).toBeNull();
  });

  it("creates and updates session object and returns user", async () => {
    const session = {userId: -1};
    const user = await controller.createUser({email: 'test@mail.com', password: 'test'}, session);
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });

  it("updates and returns user", async () => {
    const user = await controller.updateUser('1', {email:'newMail@mail.com', password: 'newPassword'});
    expect(user.email).toEqual('newMail@mail.com');
    expect(user.password).toEqual('newPassword');
  });

  it("removes and returns user", async () => {
    const user = await controller.removeUser('1');
    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
  });

});
