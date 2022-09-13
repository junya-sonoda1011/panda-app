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
  describe('POST /signup', () => {
    const normalCases = [
      {
        msg: '正常系',
        requestBody: {
          name: 'testUser1',
          work: 'work1',
          hobby: 'hobby1',
          password: 'test1234',
        },
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
  });

  describe('POST /login', () => {
    const normalCases = [
      {
        msg: '正常系',
        requestBody: {
          name: 'testUser1',
          password: 'test1234',
        },
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
  });
});
