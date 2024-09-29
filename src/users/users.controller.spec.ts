import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service'; 
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn((dto) => {
      return { id: Date.now(), ...dto }; 
    }),
    findAll: jest.fn(() => [
      { id: 1, name: 'John Doe' }, 
      { id: 2, name: 'Jane Doe' },
    ]),
    findOne: jest.fn((id) => {
      if (id === 1) return { id: 1, name: 'John Doe' };
      throw new NotFoundException('User not found');
    }),
    remove: jest.fn((id) => {
      if (id === 1) return { id: 1, name: 'John Doe' };
      throw new NotFoundException('User not found');
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService, 
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


});
