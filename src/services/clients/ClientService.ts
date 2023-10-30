import { Client } from '@/entities/Client';
import { ClientRepository } from '@/repositories/ClientRepository';
import { Service } from 'typedi';

@Service()
export class ClientService {

	constructor() { }

	/**
	 * Retrieves a client by Id.
	 * @param id The Id of the client to retrieve.
	 * @returns A Promise that resolves to the retrieved client, or null if client was not found.
	 */
	async getById(id: number): Promise<Client | null> {
		return await ClientRepository.findOne({
			where: { id },
			select: { ...this.objectToSelect()},
		});
	}

	/**
	 * Retrieves all clients from the database.
	 * @param {object} params - Optional parameters to filter the results.
	 * @returns {Promise<{ data: Client[], totalRows: number }>} - 
	 * A promise that resolves to an object containing the retrieved clients and the total number of rows.
	 */
	async getAll(params?: object): Promise<{ data: Client[], totalRows: number }> {
		const [data, totalRows] = await ClientRepository.findAndCount({
			...params,
			select: { ...this.objectToSelect() },
		});
		return { data, totalRows };
	}

	/**
	 * Returns an object with the properties to be selected from the client entity.
	 * 
	 * @returns {object} An object with the properties to be selected.
	 */
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