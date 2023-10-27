import { UnauthorizedError } from 'routing-controllers';

export class InvalidCredentialsException extends UnauthorizedError {
	constructor() {
		super('Invalid credentials!');
	}
}