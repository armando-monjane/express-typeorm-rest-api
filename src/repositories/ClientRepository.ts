import { Client } from '@/entities/Client';
import { AppDataSource } from '@/data-source';

export const ClientRepository = AppDataSource.getRepository(Client).extend({
	// add custom methods here
})