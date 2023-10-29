import { User } from '@/entities/User';
import { AppDataSource } from '@/data-source';

export const UserRepository = AppDataSource.getRepository(User).extend({
	async findByEmail(email: string): Promise<User | null> {
		return this.findOne({ where: { email } });
	},
});
