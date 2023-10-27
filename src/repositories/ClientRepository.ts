import { Client } from '@/entities/Client';
import { AppDataSource } from '@/data-source';

export const ClientRepository = AppDataSource.getRepository(Client).extend({
	async findByEmail(email: string): Promise<Client | null> {
		return this.findOne({ where: { email } });
	},
})