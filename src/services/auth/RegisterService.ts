import * as fs from 'fs';
import path from 'path';

import { appConfig } from '@/config/app';
import { ClientRepository } from '@/repositories/ClientRepository';
import { RegisterRequest } from '../../types/requests/RegisterRequest';
import { Service } from 'typedi';
import { AuthService } from './AuthService';
import { HashService } from '../hash/HashService';
import { AuthResult } from '@/types/dtos/AuthResult';
import { UserRepository } from '@/repositories/UserRepository';
import { IClientCreate } from '@/types/dtos/IClientCreate';
import { Client } from '@/entities/Client';
import { IFile } from '@/types/dtos/IFile';
import { IPhoto } from '@/types/dtos/IPhoto';


@Service()
export class RegisterService {
	constructor(private authService: AuthService, private hashService: HashService) { }

	async register(request: RegisterRequest, files: IFile[]) {

		const userByEmail = await UserRepository.findByEmail(request.email);
		if (userByEmail) {
			throw new Error(`Account with email ${request.email} already exists! Please login instead.`);
		}

		const userToCreate = {
			...request,
			role: 'client',
			password: await this.hashService.make(request.password)
		};

		const client: IClientCreate = {
			...request,
			user: {
				...userToCreate,
				photos: [],
			},
		}

		return await ClientRepository.manager.transaction(async transactionalEntityManager => {
			client.avatar = client.avatar || 'https://www.gravatar.com/avatar';
			const photos = this.generatePhotos(files);
			client.user.photos = photos;

			const createdClient = transactionalEntityManager.create<Client>(Client, client);
			const newClient = await transactionalEntityManager.save<Client>(createdClient);

			await this.uploadFiles(photos);

			const { user } = newClient;

			const { access_token } = this.authService.sign(
				{
					userId: user.id,
					email: user.email,
					role: user.role
				}) as AuthResult;

			return {
				id: newClient.id,
				email: user.email,
				fullName: user.firstName + ' ' + user.lastName,
				avatar: newClient.avatar,
				accessToken: access_token,
			};
		})
	}

	private async uploadFiles(photos: IPhoto[]): Promise<void> {
		const uploadDir = path.join(appConfig.appPath, 'public/uploads');

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