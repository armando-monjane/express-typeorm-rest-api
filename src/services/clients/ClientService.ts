import { Client } from '@/entities/Client';
import { ClientRepository } from '@/repositories/ClientRepository';
import { Service } from 'typedi';

@Service()
export class ClientService {

	constructor() { }

	async getById(id: number): Promise<Client | null> {
		return await ClientRepository.findOne({
			where: { id },
			select: { ...this.objectToSelect()},
		});
	}

	async getAll(params?: object): Promise<{ data: Client[], totalRows: number }> {
		const [data, totalRows] = await ClientRepository.findAndCount({
			...params,
			select: { ...this.objectToSelect() },
		});
		return { data, totalRows };
	}

	private objectToSelect(): object {
		return {
			id: true,
			avatar: true,
			firstName: true,
			lastName: true,
			email: true,
			role: true,
			createdAt: true,
			updatedAt: true,
		};
	}
}