import { JsonController, Body, Post } from 'routing-controllers';
import { Service } from 'typedi';
import { LoginService } from '@/services/auth/LoginService';
import { OpenAPI } from 'routing-controllers-openapi';
import { LoginRequest } from '@/types/requests/LoginRequest';

@Service()
@OpenAPI({
	tags: ['Auth'],
})
@JsonController('/login')
export class LoginController {
	public constructor(private loginService: LoginService) {}

    @Post()
	public async login(@Body() user: LoginRequest) {
		return await this.loginService.login(user);
	}
}