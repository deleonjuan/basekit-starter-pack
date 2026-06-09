import { DataSource, DataSourceOptions } from 'typeorm';
import config from '../config/config';

const cfg = config();

export const baseDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: cfg.database.host,
  port: cfg.database.port,
  username: cfg.database.username,
  password: cfg.database.password,
  schema: 'public',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false,
  migrationsTableName: 'migrations',
  migrationsRun: false,
  logging: false, //process.env.NODE_ENV !== 'production',
};

export const masterDataSourceOptions = {
  ...(baseDataSourceOptions as DataSourceOptions),
  database: cfg.database.name,
} as DataSourceOptions;

const dataSource = new DataSource(baseDataSourceOptions);
export default dataSource;
