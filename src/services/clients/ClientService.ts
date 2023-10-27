import { Client } from '@/entities/Client';
import { ClientRepository } from '@/repositories/ClientRepository';
import { Service } from 'typedi';

@Service()
export class ClientService {

	constructor() { }

	async getById(id: number): Promise<Client | null> {
		return await ClientRepository.findOne({
			where: { id },
			select: {
				id: true,
				avatar: true,
				user: {
					firstName: true,
					lastName: true,
					email: true,
					role: true,
					createdAt: true,
					updatedAt: true,
				},
			},
			relations: ['user'],
		});
	}

	async getAll(params?: object): Promise<{ data: Client[], totalRows: number }> {
		const [data, totalRows] = await ClientRepository.findAndCount({
			...params,
			select: {
				id: true,
				avatar: true,
				user: {
					firstName: true,
					lastName: true,
					email: true,
					role: true,
					createdAt: true,
					updatedAt: true,
				},
			},
			relations: ['user'],
		});
		return { data, totalRows };
	}
}