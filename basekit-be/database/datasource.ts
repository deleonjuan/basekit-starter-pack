import { DataSource, DataSourceOptions } from 'typeorm';
import config from '../config/config';

const cfg = config();
const isTsRuntime = __filename.endsWith('.ts');

// Isolate the postgres variant and remove `database` so callers are forced to supply it.
type PostgresBaseOptions = Omit<Extract<DataSourceOptions, { type: 'postgres' }>, 'database'>;

export const baseDataSourceOptions: PostgresBaseOptions = {
  type: 'postgres',
  host: cfg.database.host,
  port: cfg.database.port,
  username: cfg.database.username,
  password: cfg.database.password,
  schema: 'public',
  synchronize: false,
  migrationsTableName: 'migrations',
  migrationsRun: false,
  logging: false,
  entities: isTsRuntime ? ['src/**/*.entity.ts'] : ['dist/**/*.entity.js'],
  migrations: isTsRuntime
    ? ['database/migrations/*.ts']
    : ['dist/database/migrations/*.js'],
  
};

export const masterDataSourceOptions = {
  ...(baseDataSourceOptions as DataSourceOptions),
  database: cfg.database.name,
} as DataSourceOptions;

const dataSource = new DataSource(masterDataSourceOptions);
export default dataSource;
