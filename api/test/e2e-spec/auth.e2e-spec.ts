import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { Connection, getConnection } from 'typeorm';
import { AuthControllerModule } from '../../src/controller/auth/auth.controller.module';
import {
  TestGlobalModule,
  testValidationPipeOptions,
} from '../test-global.module';
import { seed } from '../../src/models/seed/seed';
import { UserTestConfirmation } from '../confirmations/user.test-confirmation';

describe('AuthController', () => {
  let app: INestApplication;
  let connection: Connection;

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
      name: 'testUser',
      work: 'work',
      hobby: 'hobby',
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
        await UserTestConfirmation.confirmSave(getConnection(), requestBody);
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
            ...{ message: ['name はstring を入力してください'] },
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
            ...{ message: ['work はstring を入力してください'] },
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
            ...{ message: ['hobby はstring を入力してください'] },
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
            ...{ message: ['password はstring を入力してください'] },
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
            ...{ message: ['name はstring を入力してください'] },
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
            ...{ message: ['work はstring を入力してください'] },
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
            ...{ message: ['hobby はstring を入力してください'] },
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
            ...{ message: ['password はstring を入力してください'] },
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
            ...{ message: ['name は入力必須項目です'] },
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
            ...{ message: ['password は入力必須項目です'] },
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
                'name はstring を入力してください',
                'name は入力必須項目です',
                'work はstring を入力してください',
                'work は入力必須項目です',
                'hobby はstring を入力してください',
                'hobby は入力必須項目です',
                'password はstring を入力してください',
                'password は入力必須項目です',
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
            ...{ message: ['unknownKey という項目は存在しません'] },
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
            ...{ message: ['name はstring を入力してください'] },
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
            ...{ message: ['password はstring を入力してください'] },
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
            ...{ message: ['name はstring を入力してください'] },
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
            ...{ message: ['password はstring を入力してください'] },
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
                'name はstring を入力してください',
                'name は入力必須項目です',
                'password はstring を入力してください',
                'password は入力必須項目です',
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
            ...{ message: ['unknownKey という項目は存在しません'] },
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
