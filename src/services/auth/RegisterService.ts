import * as fs from 'fs';
import path from 'path';
import { env } from 'process';

import { appConfig } from '@/config/app';
import { ClientRepository } from '@/repositories/ClientRepository';
import { RegisterRequest } from '@/types/requests/RegisterRequest';
import { Service } from 'typedi';
import { AuthService } from '@/services/auth/AuthService';
import { HashService } from '@/services/hash/HashService';
import { AuthResult } from '@/types/dtos/AuthResult';
import { IClientCreate } from '@/types/dtos/IClientCreate';
import { Client } from '@/entities/Client';
import { IFile } from '@/types/dtos/IFile';
import { IPhoto } from '@/types/dtos/IPhoto';
import { BadRequestError } from 'routing-controllers';
import { UserRole } from '@/entities/UserRole';

@Service()
export class RegisterService {
	constructor(private authService: AuthService, private hashService: HashService) { }

	async register(request: RegisterRequest, files: IFile[]) {

		const userByEmail = await ClientRepository.findByEmail(request.email);
		if (userByEmail) {
			throw new Error(`Account with email ${request.email} already exists! Please login instead.`);
		}

		this.validatesFiles(files);

		const client: IClientCreate = {
			...request,
			role: UserRole.CLIENT,
			password: await this.hashService.make(request.password),
			photos: [],
		}

		return await ClientRepository.manager.transaction(async transactionalEntityManager => {
			client.avatar = client.avatar || 'https://www.gravatar.com/avatar';
			const photos = this.generatePhotos(files);
			client.photos = photos;

			// TODO: fix client type to avoid this cast
			const clientToBeCreated = transactionalEntityManager.create<Client>(Client, ((client as unknown) as Client));
			const registeredClient = await transactionalEntityManager.save<Client>(clientToBeCreated);

			await this.uploadFiles(photos);

			const { email, role, firstName, lastName, avatar } = registeredClient;

			const { access_token } = this.authService.sign(
				{
					userId: registeredClient.id,
					email,
					role,
				}) as AuthResult;

			return {
				id: registeredClient.id,
				email,
				fullName: firstName + ' ' + lastName,
				avatar,
				accessToken: access_token,
			};
		});
	}

	private validatesFiles(files: IFile[]) {
		if (!files || files.length < 4) {
			throw new Error('Please upload at least 4 images.');
		}

		if (files.some(file => !file.mimetype.startsWith('image'))) {
			throw new BadRequestError('Please upload only images.');
		}

		const maxUploadFiles = Number(env.MAX_UPLOAD_FILES) || 20;
		if (files.length >= maxUploadFiles) {
			throw new BadRequestError(`Please upload less than ${maxUploadFiles} images.`);
		}
	}

	private async uploadFiles(photos: IPhoto[]): Promise<void> {
		const uploadDir = path.join(appConfig.uploadDirectory);

		// Create uploads directory if it doesn't exist
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir);
		}

		for (const photo of photos) {
			// Handle each file
			const filePath = path.join(uploadDir, photo.url);

			const writeStream = fs.createWriteStream(filePath);
			await new Promise<void>((resolve, reject) => {
				writeStream.on('finish', () => {
					resolve();
				});
				writeStream.on('error', (error) => { reject(error); });
				writeStream.write(photo.buffer);
				writeStream.end();
			});
		}
	}

	private generatePhotos(files: IFile[]): IPhoto[] {
		return files.map(file => ({
			url: `${Date.now()}-${file.originalname}`,
			name: file.originalname,
			buffer: file.buffer,
		}));
	}
}