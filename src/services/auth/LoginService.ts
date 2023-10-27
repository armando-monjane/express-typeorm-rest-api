import { Service } from 'typedi';
import { AuthService } from '@/services/auth/AuthService';
import { LoginRequest } from '@/types/requests/LoginRequest';
import { HashService } from '@/services/hash/HashService';
import { InvalidCredentialsException } from '@/exceptions/auth/InvalidCredentialsException';
import { ClientRepository } from '@/repositories/ClientRepository';
import { AuthResult } from '@/types/dtos/AuthResult';

@Service()
export class LoginService {
	constructor(private authService: AuthService, private hashService: HashService) { }

	public async login(data: LoginRequest) {
		const client = await ClientRepository.findOne({
			where: { user: {
				isActive: true,
				email: data.email,
			}},
			relations: ['user'],
		});

		if (!client) {
			throw new InvalidCredentialsException();
		}

		const { user } = client;

		if (!(await this.hashService.compare(data.password, client.user.password))) {
			throw new InvalidCredentialsException();
		}

		const { access_token } = this.authService.sign(
			{
				userId: user.id,
				email: user.email,
				role: user.role
			}) as AuthResult;

		return {
			id: user.id,
			email: user.email,
			fullName: user.firstName + ' ' + user.lastName,
			avatar: client.avatar,
			accessToken: access_token,
		}
	}
}