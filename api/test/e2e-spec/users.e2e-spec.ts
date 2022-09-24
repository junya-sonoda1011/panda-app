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
import { Connection, getConnection } from 'typeorm';
import { UserResponse } from '../../src/controller/users/response/find-user.response';
import { AuthService } from '../../src/modules/auth/auth.service';
import { UserSaveConfirmation } from '../../test/save-confirmations/user.save-confirmation';

describe('UsersController', () => {
  let app: INestApplication;
  let connection: Connection;
  let authService: AuthService;
  let token: string[];

  type GetToken = (name: string, password: string) => Promise<string[]>;
  let getToken: GetToken;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TestGlobalModule, AuthControllerModule, UsersControllerModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(new ValidationPipe(testValidationPipeOptions));
    connection = moduleRef.get<Connection>(Connection);

    authService = moduleRef.get<AuthService>(AuthService);
    await app.init();
    await app.getHttpAdapter().getInstance();

    await seed(connection);

    getToken = async (name: string, password: string): Promise<string[]> => {
      return Object.values(
        await authService.login({
          name: name,
          password: password,
        }),
      );
    };
    token = await getToken('testUser1', 'test1234');
  });

  afterAll(async () => {
    await app.close();
  });

  let usersResponseValue;

  const findUsersResponse = (
    numberOfUsers: number,
  ): UserResponse | UserResponse[] => {
    usersResponseValue = [];
    for (let i = 1; i < numberOfUsers + 1; i++) {
      const user = {
        name: 'testUser' + i,
        work: 'work' + i,
        hobby: 'hobby' + i,
      };
      usersResponseValue.push(user);
    }
    return usersResponseValue.length == 1
      ? usersResponseValue[0]
      : usersResponseValue;
  };

  const badRequestResponse = {
    statusCode: 400,
    message: [],
    error: 'Bad Request',
  };

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
          data: findUsersResponse(2),
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
          data: findUsersResponse(1),
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
          data: findUsersResponse(1),
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

  const updateUserValue = {
    first: 'test1',
    second: 'test2',
  };

  const updateRequestBody = {
    name: 'updateTest1',
    password: 'updateTest1234',
  };

  const updateResponse = { message: 'ユーザー情報を更新しました' };

  const updateNormalCases = [
    {
      msg: 'ユーザー情報更新（一部の項目）',
      id: '2',
      requestBody: updateRequestBody,
      expected: {
        status: 200,
        data: updateResponse,
      },
    },
    {
      msg: 'ユーザー情報更新（全項目）',
      id: '2',
      requestBody: { ...updateRequestBody },
      expected: {
        status: 200,
        data: updateResponse,
      },
    },
  ];

  const updateSemiNormalCases = [
    {
      msg: 'accessToken が不正',
      id: '2',
      isValidToken: false,
      requestBody: updateRequestBody,
      expected: {
        status: 401,
        data: unauthorizedResponse,
      },
    },
    {
      msg: 'name の値がNumber',
      id: '2',
      isValidToken: true,
      requestBody: {
        ...updateRequestBody,
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
      id: '2',
      isValidToken: true,
      requestBody: {
        ...updateRequestBody,
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
      id: '2',
      isValidToken: true,
      requestBody: {
        ...updateRequestBody,
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
      id: '2',
      isValidToken: true,
      requestBody: {
        ...updateRequestBody,
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
      id: '2',
      isValidToken: true,
      requestBody: {
        ...updateRequestBody,
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
      id: '2',
      isValidToken: true,
      requestBody: {
        ...updateRequestBody,
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
      id: '2',
      isValidToken: true,
      requestBody: {
        ...updateRequestBody,
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
      id: '2',
      isValidToken: true,
      requestBody: {
        ...updateRequestBody,
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
      msg: '存在しない Key がある',
      id: '2',
      isValidToken: true,
      requestBody: {
        ...updateRequestBody,
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

  describe('PUT /users/me', () => {
    describe.each(updateNormalCases)(
      '正常系',
      ({ msg, requestBody, expected }) => {
        afterAll(async () => {
          token = await getToken(requestBody.name, requestBody.password);
        });
        it(msg, async () => {
          await request(app.getHttpServer())
            .put(`/users/me`)
            .set('Authorization', 'Bearer ' + token)
            .send(requestBody)
            .expect(expected.status)
            .expect(expected.data);
          await UserSaveConfirmation.confirmSave(getConnection(), requestBody);
        });
      },
    );

    describe.each(updateSemiNormalCases)(
      '準正常系',
      ({ msg, isValidToken, requestBody, expected }) => {
        it(msg, async () => {
          await request(app.getHttpServer())
            .put(`/users/me`)
            .set(
              'Authorization',
              isValidToken ? 'Bearer ' + token : 'Bearer ' + 'invalidToken',
            )
            .send(requestBody)
            .expect(expected.status)
            .expect(expected.data);
        });
      },
    );
  });

  describe('PUT /users/:userId', () => {
    updateSemiNormalCases.unshift({
      msg: '存在しないユーザーID',
      id: '10',
      isValidToken: true,
      requestBody: updateRequestBody,
      expected: {
        status: 404,
        data: notFoundResponse,
      },
    });
    describe.each(updateNormalCases)(
      '正常系',
      ({ msg, id, requestBody, expected }) => {
        beforeAll(async () => {
          // ユニーク制約があるので、2回目のテストでユーザー名を書き換える
          Object.assign(requestBody, {
            ...requestBody,
            ...{ name: 'updateTest2' },
          });
        });
        afterAll(async () => {
          if (msg == 'ユーザー情報更新（全項目）') {
            token = await getToken('updateTest1', 'updateTest1234');
          }
        });
        it(msg, async () => {
          await request(app.getHttpServer())
            .put(`/users/${id}`)
            .set('Authorization', 'Bearer ' + token)
            .send(requestBody)
            .expect(expected.status)
            .expect(expected.data);
          await UserSaveConfirmation.confirmSave(
            getConnection(),
            requestBody,
            id,
          );
        });
      },
    );

    describe.each(updateSemiNormalCases)(
      '準正常系',
      ({ msg, id, isValidToken, requestBody, expected }) => {
        it(msg, async () => {
          await request(app.getHttpServer())
            .put(`/users/${id}`)
            .set(
              'Authorization',
              isValidToken ? 'Bearer ' + token : 'Bearer ' + 'invalidToken',
            )
            .send(requestBody)
            .expect(expected.status)
            .expect(expected.data);
        });
      },
    );
  });
});
