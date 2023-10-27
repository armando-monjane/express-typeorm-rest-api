import { authConfig } from '@/config/auth';
import { Service } from 'typedi';
import { JWTProvider, IAuthProvider } from '@/services/auth/providers';

@Service()
export class AuthService {
	private provider!: IAuthProvider;

	public constructor() {
		this.setProvider(authConfig.defaultProvider);
	}

	public setProvider(provider: string): this {
		switch (provider) {
		case 'jwt':
			this.provider = new JWTProvider();
			break;

		default:
			this.provider = new JWTProvider();
			break;
		}

		return this;
	}

	public sign(payload: object): object {
		return this.provider.sign(payload);
	}
}