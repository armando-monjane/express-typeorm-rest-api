import { Service } from 'typedi';
import { JsonController, Body, Post, UploadedFiles } from 'routing-controllers';

import { OpenAPI } from 'routing-controllers-openapi';
import { RegisterService } from '@/services/auth/RegisterService';
import { RegisterRequest } from '@/types/requests/RegisterRequest';
import { IFile } from '@/types/dtos/IFile';
import { ILoggedUser } from '@/types/dtos/ILoggedUser';

@Service()
@OpenAPI({
	tags: ['Auth'],
})
@JsonController('/register')
export class RegisterController {
	public constructor(private registerService: RegisterService) { }

    
	/**
	 * Registers a new user with the provided registration data and files.
	 * Receives a multipart/form-data request with the following fields:
	 * @param {IFile[]} files - The files uploaded during registration.
	 * @param {RegisterRequest} registerRequest - The registration data.
	 * @returns {Promise<ILoggedUser>} - A Promise that resolves to the result of the registration.
	 */
	@Post()
	public async register(
        @UploadedFiles('files') files: IFile[],
        @Body() registerRequest: RegisterRequest,
	): Promise<ILoggedUser>{
		return await this.registerService.register(registerRequest, files);
	}
}
