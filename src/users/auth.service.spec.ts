import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email) => {
        const filteredUsers = users.filter(user => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {id: new Date().getTime(), email, password} as User
        users.push(user);
        return Promise.resolve(user);
      }
    }
    const module = await Test.createTestingModule({
      providers: [AuthService, {
        provide: UsersService,
        useValue: fakeUsersService
      }]
    }).compile();

    service = module.get(AuthService);
  })

  it("can create an instance of auth service", async () => {
    expect(service).toBeDefined();
  });

  it("creates a new user with a salted and hashed password", async () => {
    const user = await service.signup('test@test.com', 'test');
    expect(user.password).not.toEqual('test');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with an email that is in use', async () => {
    await service.signup('asdflkj@asdlfkj.com', 'passdflkj');
    await expect(
      service.signup('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(BadRequestException);
  })

  it('throws an error if signin is called with an unused email', async () => {
    await expect(
      service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  })

  it('throws an error if an invalid password is provided', async () => {
    await service.signup('asdflkj@asdlfkj.com', '12345');
    await expect(
      service.signin('asdflkj@asdlfkj.com', '1234'),
    ).rejects.toThrow(BadRequestException);
  })

  it("returns a user if correct password is provided", async () => {
    await service.signup('test@test.com', 'password');
    const user = await service.signin('test@test.com', 'password');
    expect(user).toBeDefined();
  });

})
