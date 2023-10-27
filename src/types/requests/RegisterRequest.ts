import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class RegisterRequest {
	@IsString()
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
