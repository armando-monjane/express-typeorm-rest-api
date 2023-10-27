import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class LoginRequest {
	@IsNotEmpty()
	@IsEmail()
		email!: string;

	@IsNotEmpty()
	@IsString()
		password!: string;
}
