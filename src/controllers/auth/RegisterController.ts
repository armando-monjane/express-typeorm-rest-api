import { Service } from 'typedi';
import { JsonController, Body, Post, UploadedFiles } from 'routing-controllers';

import { OpenAPI } from 'routing-controllers-openapi';
import { RegisterService } from '@/services/auth/RegisterService';
import { RegisterRequest } from '@/types/requests/RegisterRequest';
import { IFile } from '@/types/dtos/IFile';

@Service()
@OpenAPI({
	tags: ['Auth'],
})
@JsonController('/register')
export class RegisterController {
	public constructor(private registerService: RegisterService) { }

    @Post()
	public async register(
        @UploadedFiles('files') files: IFile[],
        @Body() registerRequest: RegisterRequest,
	) {
		return await this.registerService.register(registerRequest, files);
	}
}
