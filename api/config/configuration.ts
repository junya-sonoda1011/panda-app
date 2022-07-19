export default () => ({
  database: {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    username: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    autoLoadEntities: true,
    entities: ['dist/entities/*.entity.js'],
    migrations: ['dist/migrations/*.js'],
    cli: {
      entitiesDir: 'src/models/entities',
      migrationsDir: 'src/models/migrations',
    },
  },
});
