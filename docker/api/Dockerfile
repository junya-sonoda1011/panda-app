FROM node:16.16.0-alpine
RUN yarn global add @nestjs/cli && \
    apk add --no-cache make gcc g++ python3 && \
    yarn add bcrypt && \
    yarn add --dev @types/bcrypt && \
    yarn install --force && \
    apk del make gcc g++ python3
WORKDIR /work/api
COPY ./api /work/api/
CMD ["yarn", "run", "start:dev"]
