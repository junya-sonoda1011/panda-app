import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UsersControllerModule } from '../../src/controller/users/users.controller.module';
import {
  TestGlobalModule,
  testValidationPipeOptions,
} from '../test-global.module';
import * as request from 'supertest';
import { AuthControllerModule } from '../../src/controller/auth/auth.controller.module';

describe('UsersController', () => {
  let app: INestApplication;
  let accessToken;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TestGlobalModule, AuthControllerModule, UsersControllerModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(new ValidationPipe(testValidationPipeOptions));

    await app.init();
    await app.getHttpAdapter().getInstance();

    const res = await request(app.getHttpServer()).post('/auth/login').send({
      name: 'testUser',
      password: 'test1234',
    });

    accessToken = Object.values(JSON.parse(res.text));
  });

  afterAll(async () => {
    await app.close();
  });
  describe('GET /users/:userId', () => {
    const normalCases = [
      {
        msg: '正常系',
        id: '1',
        expected: {
          status: 200,
          data: {
            name: 'testUser',
            work: 'work1',
            hobby: 'hobby1',
          },
        },
      },
    ];
    describe.each(normalCases)('正常系', ({ msg, id, expected }) => {
      it(msg, async () => {
        await request(app.getHttpServer())
          .get(`/users/${id}`)
          .set('Authorization', 'Bearer ' + accessToken)
          .expect(expected.status)
          .expect(expected.data);
      });
    });
  });
  describe('GET /users/me', () => {
    const normalCases = [
      {
        msg: '正常系',
        expected: {
          status: 200,
          data: {
            name: 'testUser',
            work: 'work1',
            hobby: 'hobby1',
          },
        },
      },
    ];
    describe.each(normalCases)('正常系', ({ msg, expected }) => {
      it(msg, async () => {
        await request(app.getHttpServer())
          .get('/users/me')
          .set('Authorization', 'Bearer ' + accessToken)
          .expect(expected.status)
          .expect(expected.data);
      });
    });
  });
});
