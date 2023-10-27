import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class RegisterRequest {
	avatar!: string;
	@IsNotEmpty()
	@IsString()
		firstName!: string;

	@IsNotEmpty()
	@IsString()
		lastName!: string;

	@IsNotEmpty()
	@IsEmail()
		email!: string;

	@IsNotEmpty()
	@IsString()
		password!: string;
}
