import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class RegisterRequest {
	avatar?: string;

	@IsString()
	@IsNotEmpty()
		firstName!: string;

	@IsString()
	@IsNotEmpty()
		lastName!: string;

	@IsEmail({}, {
		message: 'please provide a valid email!'
	})
	@IsNotEmpty({
		message: 'email is required!'
	})
		email!: string;

	@IsString()
	@IsNotEmpty({
		message: 'password is required!'
	})
		password!: string;
}
