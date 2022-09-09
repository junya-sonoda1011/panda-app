import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

describe('UsersServiceTest', () => {
  let usersService;

  const mockUsersService = () => ({
    save: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    findByPayload: jest.fn(),
  });

  const mockUser = {
    createdAt: new Date(),
    updatedAt: new Date(),
    id: '1',
    name: 'testName',
    work: 'testWork',
    hobby: 'testHobby',
    password: 'testPassword',
  };

  const mockFoundUser = {
    name: 'testName',
    work: 'testWork',
    hobby: 'testHobby',
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useFactory: mockUsersService,
        },
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
  });

  describe('save', () => {
    it('正常系', async () => {
      const mockSavedUser = {
        createdAt: new Date(),
        updatedAt: new Date(),
        id: '1',
        name: 'testName',
        work: 'testWork',
        hobby: 'testHobby',
        password: bcrypt.hash(mockUser.password, await bcrypt.genSalt()),
      };

      usersService.save.mockResolvedValue(mockSavedUser);
      const result = await usersService.save({
        name: 'testName',
        work: 'testWork',
        hobby: 'testHobby',
      });
      expect(result).toEqual(mockSavedUser);
    });
  });

  describe('findById', () => {
    it('正常系', async () => {
      usersService.findById.mockResolvedValue(mockFoundUser);

      const result = await usersService.findById(mockUser.id);
      expect(result).toEqual(mockFoundUser);
    });

    it('準正常系: 存在しないユーザーID を指定した場合undefined が返る', async () => {
      expect(await expect(usersService.findById('2')).toEqual(undefined));
    });
  });

  describe('findByName', () => {
    it('正常系', async () => {
      usersService.findByName.mockResolvedValue(mockFoundUser);

      const result = await usersService.findByName(mockUser.name);
      expect(result).toEqual(mockFoundUser);
    });

    it('準正常系: 存在しないユーザー名 を指定した場合undefined が返る', async () => {
      expect(
        await expect(usersService.findByName('unknownUser')).toEqual(undefined),
      );
    });
  });

  describe('findByPayload', () => {
    const mockNormalCasePayload = { userName: 'testName', id: '1' };

    it('正常系', async () => {
      usersService.findByPayload.mockResolvedValue(mockFoundUser);

      const result = await usersService.findByPayload(mockNormalCasePayload);
      expect(result).toEqual(mockFoundUser);
    });

    it('準正常系: 存在しないユーザー情報 を指定した場合undefined が返る', async () => {
      const mockSemiNormalCasePayload = { userName: 'unknownName', id: '2' };

      expect(
        await expect(
          usersService.findByPayload(mockSemiNormalCasePayload),
        ).toEqual(undefined),
      );
    });
  });
});
