import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UsersControllerModule } from '../../src/controller/users/users.controller.module';
import {
  TestGlobalModule,
  testValidationPipeOptions,
} from '../test-global.module';
import * as request from 'supertest';
import { AuthControllerModule } from '../../src/controller/auth/auth.controller.module';
import { seed } from '../../src/models/seed/seed';
import { Connection } from 'typeorm';
import { lastValueFrom } from 'rxjs';
import { UserResponse } from '../../src/controller/users/response/find-user.response';

describe('UsersController', () => {
  let app: INestApplication;
  let connection;
  let token;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TestGlobalModule, AuthControllerModule, UsersControllerModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(new ValidationPipe(testValidationPipeOptions));
    connection = moduleRef.get<Connection>(Connection);

    await app.init();
    await app.getHttpAdapter().getInstance();

    await seed(connection);

    const res = await request(app.getHttpServer()).post('/auth/login').send({
      name: 'testUser1',
      password: 'test1234',
    });

    token = Object.values(JSON.parse(res.text));
  });

  afterAll(async () => {
    await app.close();
  });

  let responseValue;

  const response = (numberOfUsers: number): UserResponse | UserResponse[] => {
    responseValue = [];
    for (let i = 1; i < numberOfUsers + 1; i++) {
      const user = {
        name: 'testUser' + i,
        work: 'work' + i,
        hobby: 'hobby' + i,
      };
      responseValue.push(user);
    }
    return responseValue.length == 1 ? responseValue[0] : responseValue;
  };

  console.log('getResponse', response(1));

  const unauthorizedResponse = {
    statusCode: 401,
    message: 'ログインしてください',
    error: 'Unauthorized',
  };

  const notFoundResponse = {
    statusCode: 404,
    message: '指定されたID のユーザーが存在しません',
    error: 'Not Found',
  };

  describe('GET /users', () => {
    const normalCases = [
      {
        msg: 'ユーザー一覧取得',
        expected: {
          status: 200,
          data: response(2),
        },
      },
    ];

    describe.each(normalCases)('正常系', ({ msg, expected }) => {
      it(msg, async () => {
        await request(app.getHttpServer())
          .get('/users')
          .set('Authorization', 'Bearer ' + token)
          .expect(expected.status)
          .expect(expected.data);
      });
    });

    const semiNormalCases = [
      {
        msg: 'accessToken が不正',
        expected: {
          status: 401,
          data: unauthorizedResponse,
        },
      },
    ];

    describe.each(semiNormalCases)('準正常系', ({ msg, expected }) => {
      it(msg, async () => {
        await request(app.getHttpServer())
          .get('/users')
          .set('Authorization', 'Bearer ' + 'invalidToken')
          .expect(expected.status)
          .expect(expected.data);
      });
    });
  });

  describe('GET /users/me', () => {
    const normalCases = [
      {
        msg: 'ログインユーザーの情報取得',
        expected: {
          status: 200,
          data: response(1),
        },
      },
    ];
    describe.each(normalCases)('正常系', ({ msg, expected }) => {
      it(msg, async () => {
        await request(app.getHttpServer())
          .get('/users/me')
          .set('Authorization', 'Bearer ' + token)
          .expect(expected.status)
          .expect(expected.data);
      });
    });

    const semiNormalCases = [
      {
        msg: 'accessToken が不正',
        expected: {
          status: 401,
          data: unauthorizedResponse,
        },
      },
    ];
    describe.each(semiNormalCases)('準正常系', ({ msg, expected }) => {
      it(msg, async () => {
        await request(app.getHttpServer())
          .get('/users/me')
          .set('Authorization', 'Bearer ' + 'invalidToken')
          .expect(expected.status)
          .expect(expected.data);
      });
    });
  });

  describe('GET /users/:userId', () => {
    const normalCases = [
      {
        msg: '指定したID のユーザー情報取得',
        id: '1',
        expected: {
          status: 200,
          data: response(1),
        },
      },
    ];
    describe.each(normalCases)('正常系', ({ msg, id, expected }) => {
      it(msg, async () => {
        await request(app.getHttpServer())
          .get(`/users/${id}`)
          .set('Authorization', 'Bearer ' + token)
          .expect(expected.status)
          .expect(expected.data);
      });
    });

    const semiNormalCases = [
      {
        msg: '存在しないユーザーID',
        id: '10',
        isValidToken: true,
        expected: {
          status: 404,
          data: notFoundResponse,
        },
      },
      {
        msg: 'accessToken が不正',
        id: '1',
        isValidToken: false,
        expected: {
          status: 401,
          data: unauthorizedResponse,
        },
      },
    ];
    describe.each(semiNormalCases)(
      '準正常系',
      ({ msg, id, isValidToken, expected }) => {
        it(msg, async () => {
          await request(app.getHttpServer())
            .get(`/users/${id}`)
            .set(
              'Authorization',
              isValidToken ? 'Bearer ' + token : 'Bearer ' + 'invalidToken',
            )
            .expect(expected.status)
            .expect(expected.data);
        });
      },
    );
  });
});
