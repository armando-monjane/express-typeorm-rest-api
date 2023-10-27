import { IPhoto } from './IPhoto';

export interface IClientCreate {
	avatar: string;
	user: {
		firstName: string;
		lastName: string;
		email: string;
		password: string;
		photos: IPhoto[];
	};
}
