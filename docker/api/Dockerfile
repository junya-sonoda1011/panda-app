FROM node:16.16.0-alpine
RUN yarn global add @nestjs/cli
WORKDIR /work/api
COPY ./api /work/api/
CMD ["yarn", "run", "start:dev"]
