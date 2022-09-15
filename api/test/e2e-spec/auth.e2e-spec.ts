import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { Connection } from 'typeorm';
import { AuthControllerModule } from '../../src/controller/auth/auth.controller.module';
import {
  TestGlobalModule,
  testValidationPipeOptions,
} from '../test-global.module';
import { seed } from '../../src/models/seed/seed';

describe('AuthController', () => {
  let app;
  let connection;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TestGlobalModule, AuthControllerModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(new ValidationPipe(testValidationPipeOptions));
    connection = moduleRef.get<Connection>(Connection);

    await app.init();
    await app.getHttpAdapter().getInstance();

    await seed(connection);
  });

  afterAll(async () => {
    await app.close();
  });

  const badRequestResponse = {
    statusCode: 400,
    message: [],
    error: 'Bad Request',
  };

  const unauthorizedResponse = {
    statusCode: 401,
    message: 'ユーザー名またはパスワードを確認してください',
    error: 'Unauthorized',
  };

  describe('POST /signup', () => {
    const signupRequestBody = {
      name: 'testUser1',
      work: 'work1',
      hobby: 'hobby1',
      password: 'test1234',
    };

    const normalCases = [
      {
        msg: 'ユーザー登録',
        requestBody: signupRequestBody,
        expected: {
          status: 201,
        },
      },
    ];
    describe.each(normalCases)('正常系', ({ msg, requestBody, expected }) => {
      it(msg, async () => {
        await request(app.getHttpServer())
          .post('/auth/signup')
          .send(requestBody)
          .expect(expected.status);
      });
    });

    const semiNormalCases = [
      {
        msg: 'name の値がNumber',
        requestBody: {
          ...signupRequestBody,
          ...{ name: 123 },
        },
        expected: {
          status: 400,
          data: {
            ...badRequestResponse,
            ...{ message: ['name must be a string'] },
          },
        },
      },
      {
        msg: 'work の値がNumber',
        requestBody: {
          ...signupRequestBody,
          ...{ work: 123 },
        },
        expected: {
          status: 400,
          data: {
            ...badRequestResponse,
            ...{ message: ['work must be a string'] },
          },
        },
      },
      {
        msg: 'hobby の値がNumber',
        requestBody: {
          ...signupRequestBody,
          ...{ hobby: 123 },
        },
        expected: {
          status: 400,
          data: {
            ...badRequestResponse,
            ...{ message: ['hobby must be a string'] },
          },
        },
      },
      {
        msg: 'password の値がNumber',
        requestBody: {
          ...signupRequestBody,
          ...{ password: 123 },
        },
        expected: {
          status: 400,
          data: {
            ...badRequestResponse,
            ...{ message: ['password must be a string'] },
          },
        },
      },
      {
        msg: 'name の値がBoolean',
        requestBody: {
          ...signupRequestBody,
          ...{ name: true },
        },
        expected: {
          status: 400,
          data: {
            ...badRequestResponse,
            ...{ message: ['name must be a string'] },
          },
        },
      },
      {
        msg: 'work の値がBoolean',
        requestBody: {
          ...signupRequestBody,
          ...{ work: true },
        },
        expected: {
          status: 400,
          data: {
            ...badRequestResponse,
            ...{ message: ['work must be a string'] },
          },
        },
      },
      {
        msg: 'hobby の値がBoolean',
        requestBody: {
          ...signupRequestBody,
          ...{ hobby: true },
        },
        expected: {
          status: 400,
          data: {
            ...badRequestResponse,
            ...{ message: ['hobby must be a string'] },
          },
        },
      },
      {
        msg: 'password の値がBoolean',
        requestBody: {
          ...signupRequestBody,
          ...{ password: true },
        },
        expected: {
          status: 400,
          data: {
            ...badRequestResponse,
            ...{ message: ['password must be a string'] },
          },
        },
      },
      {
        msg: 'name の値が空文字',
        requestBody: {
          ...signupRequestBody,
          ...{ name: '' },
        },
        expected: {
          status: 400,
          data: {
            ...badRequestResponse,
            ...{ message: ['name should not be empty'] },
          },
        },
      },
      {
        msg: 'password の値が空文字',
        requestBody: {
          ...signupRequestBody,
          ...{ password: '' },
        },
        expected: {
          status: 400,
          data: {
            ...badRequestResponse,
            ...{ message: ['password should not be empty'] },
          },
        },
      },
      {
        msg: 'requestBody が空のオブジェクト',
        requestBody: {},
        expected: {
          status: 400,
          data: {
            ...badRequestResponse,
            ...{
              message: [
                'name must be a string',
                'name should not be empty',
                'work must be a string',
                'hobby must be a string',
                'password must be a string',
                'password should not be empty',
              ],
            },
          },
        },
      },
      {
        msg: '存在しない Key がある',
        requestBody: {
          ...signupRequestBody,
          ...{ unknownKey: 'unknownValue' },
        },
        expected: {
          status: 400,
          data: {
            ...badRequestResponse,
            ...{ message: ['property unknownKey should not exist'] },
          },
        },
      },
    ];
    describe.each(semiNormalCases)(
      '準正常系',
      ({ msg, requestBody, expected }) => {
        it(msg, async () => {
          await request(app.getHttpServer())
            .post('/auth/signup')
            .send(requestBody)
            .expect(expected.status)
            .expect(expected.data);
        });
      },
    );
  });

  describe('POST /login', () => {
    const loginRequestBody = {
      name: 'testUser1',
      password: 'test1234',
    };
    const normalCases = [
      {
        msg: 'ユーザーログイン',
        requestBody: loginRequestBody,
        expected: {
          status: 201,
        },
      },
    ];
    describe.each(normalCases)('正常系', ({ msg, requestBody, expected }) => {
      it(msg, async () => {
        await request(app.getHttpServer())
          .post('/auth/login')
          .send(requestBody)
          .expect(expected.status);
      });
    });

    const semiNormalCases = [
      {
        msg: 'ユーザー名不一致',
        requestBody: {
          ...loginRequestBody,
          ...{ name: 'unknownUser' },
        },
        expected: {
          status: 401,
          data: unauthorizedResponse,
        },
      },
      {
        msg: 'パスワード不一致',
        requestBody: {
          ...loginRequestBody,
          ...{ password: 'unknownUser' },
        },
        expected: {
          status: 401,
          data: unauthorizedResponse,
        },
      },
      {
        msg: 'ユーザー名、パスワードともに不一致',
        requestBody: {
          name: 'unknownUser',
          password: 'unknownPassword',
        },
        expected: {
          status: 401,
          data: unauthorizedResponse,
        },
      },
      {
        msg: 'name の値がNumber',
        requestBody: {
          ...loginRequestBody,
          ...{ name: 123 },
        },
        expected: {
          status: 400,
          data: {
            ...badRequestResponse,
            ...{ message: ['name must be a string'] },
          },
        },
      },
      {
        msg: 'password の値がNumber',
        requestBody: {
          ...loginRequestBody,
          ...{ password: 123 },
        },
        expected: {
          status: 400,
          data: {
            ...badRequestResponse,
            ...{ message: ['password must be a string'] },
          },
        },
      },
      {
        msg: 'name の値がBoolean',
        requestBody: {
          ...loginRequestBody,
          ...{ name: true },
        },
        expected: {
          status: 400,
          data: {
            ...badRequestResponse,
            ...{ message: ['name must be a string'] },
          },
        },
      },
      {
        msg: 'password の値がBoolean',
        requestBody: {
          ...loginRequestBody,
          ...{ password: true },
        },
        expected: {
          status: 400,
          data: {
            ...badRequestResponse,
            ...{ message: ['password must be a string'] },
          },
        },
      },
      {
        msg: 'requestBody が空のオブジェクト',
        requestBody: {},
        expected: {
          status: 400,
          data: {
            ...badRequestResponse,
            ...{
              message: [
                'name should not be empty',
                'name must be a string',
                'password should not be empty',
                'password must be a string',
              ],
            },
          },
        },
      },
      {
        msg: '存在しない Key がある',
        requestBody: {
          ...loginRequestBody,
          ...{ unknownKey: 'unknownValue' },
        },
        expected: {
          status: 400,
          data: {
            ...badRequestResponse,
            ...{ message: ['property unknownKey should not exist'] },
          },
        },
      },
    ];
    describe.each(semiNormalCases)(
      '準正常系',
      ({ msg, requestBody, expected }) => {
        it(msg, async () => {
          await request(app.getHttpServer())
            .post('/auth/login')
            .send(requestBody)
            .expect(expected.status)
            .expect(expected.data);
        });
      },
    );
  });
});
