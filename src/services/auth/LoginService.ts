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
			where: {
				isActive: true,
				email: data.email,
			},
		});

		if (!client) {
			throw new InvalidCredentialsException();
		}

		if (!(await this.hashService.compare(data.password, client.password))) {
			throw new InvalidCredentialsException();
		}

		const { email, role, firstName, lastName, avatar } = client;
		const { access_token } = this.authService.sign(
			{
				userId: client.id,
				email,
				role
			}) as AuthResult;

		return {
			id: client.id,
			email,
			fullName: firstName + ' ' + lastName,
			avatar: avatar,
			accessToken: access_token,
		}
	}
}