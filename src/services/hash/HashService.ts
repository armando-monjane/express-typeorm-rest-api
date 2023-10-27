import { hashingConfig } from '@/config/hashing';
import { Service } from 'typedi';
import { BcryptProvider, IHashProvider } from '@/services/hash/providers';

@Service()
export class HashService {
	private provider!: IHashProvider;

	public constructor() {
		this.setDriver(hashingConfig.defaultDriver);
	}

	public setDriver(provider: string) {
		switch (provider) {
		case 'bcrypt':
			this.provider = new BcryptProvider();
			break;

		default:
			this.provider = new BcryptProvider();
			break;
		}

		return this;
	}

	public async make(data: string, saltOrRounds: string | number = 10): Promise<string> {
		return await this.provider.make(data, saltOrRounds);
	}

	public async compare(data: string, encrypted: string) {
		return await this.provider.compare(data, encrypted);
	}
}