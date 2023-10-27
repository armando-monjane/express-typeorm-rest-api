import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { env } from '@/utils/env';

type TypeOrmDatabaseType = 'postgres' | 'mysql' | 'mariadb' | 'mssql'; // add more database types as needed

const getDatabaseType = (): TypeOrmDatabaseType => {
	return env('DB_TYPE') as TypeOrmDatabaseType || 'postgres';
};

export const AppDataSource = new DataSource({
	type: getDatabaseType(),
	host: env('DB_HOST', 'localhost'),
	port: Number(env('DB_PORT', '5432')),
	username: env('DB_USERNAME', 'postgres'),
	password: env('DB_PASSWORD', 'secret'),
	database: env('DB_NAME', 'postgres'),
	dropSchema: env('TYPEORM_DROP_SCHEMA', 'false') === 'true',
	migrationsRun: env('TYPEORM_MIGRATIONS_RUN', 'false') === 'true',
	synchronize: false,
	logging: env('TYPEORM_LOGGING', 'false') === 'true',
	entities: [env('TYPEORM_ENTITIES', 'src/entities/**/*.ts')],
	migrations: [env('TYPEORM_MIGRATIONS', 'src/migrations/**/*.ts')],
	subscribers: []
})
