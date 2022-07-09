FROM node:16.13.1-alpine
RUN npm i -g @nestjs/cli
WORKDIR /work/api
COPY ./api /work/api/
CMD ["npm", "run", "start:dev"]
