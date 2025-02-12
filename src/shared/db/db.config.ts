import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { User } from 'src/modules/auth/user.entity';
import { Subject } from 'src/modules/subjects/subject.entity';
import { Topic } from 'src/modules/topics/topic.entity';
import { Progress } from 'src/modules/progress/progress.entity';
import { Role } from 'src/modules/auth/role.entity';

dotenv.config();

export const dbConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost', 
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'learning-db',
  entities: [User, Topic, Subject, Progress,Role],
  synchronize: false, 
  migrationsTableName: 'migrations',
  logging: true,
  migrations: [join(__dirname, '..', '/db/migrations', '*.{ts,js}')], 
};
const dataSource = new DataSource(dbConfig);
export default dataSource;


