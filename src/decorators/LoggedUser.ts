import { IRequest } from '@/infrastructure/interfaces/IRequest';
import { createParamDecorator } from 'routing-controllers';

export function LoggedUser() {
	return createParamDecorator({
		value: (action) => {
			const { loggedUser } = action.request as IRequest;
			return loggedUser;
		},
	});
}