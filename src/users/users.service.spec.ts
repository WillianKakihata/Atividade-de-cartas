import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

const mockUserModel = {
  find: jest.fn().mockResolvedValue([]),
  create: jest.fn().mockResolvedValue({ id: 1, name: 'John Doe' }),
  findOne: jest.fn().mockResolvedValue(null),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'UserModel',
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});