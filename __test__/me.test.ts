import request from 'supertest';
import App from '@app';
import { AppDataSource } from '@/data-source';
import { Application } from 'express';
import { ClientRepository } from '@/repositories/ClientRepository';
import { HashService } from '@/services/hash/HashService';
import { appConfig } from '@/config/app';

type LoginResponseBody = {
    accessToken?: string;
}

type MeResponseBody = {
    id: string;
    email: string;
    fullName: string;
    avatar: string;
}

describe(`${appConfig.routePrefix}/users/me route`, () => {
	let app: Application;
	beforeAll(async () => {
		await App.bootstrap();
		app = App.app;
	}, 10000);

	afterAll(async () => {
		await AppDataSource.destroy();
	});


	it('should return unauthorized when bearer token is not passed', async () => {
		const response = await request(app).get('/api/users/me').send();

		expect(response.status).toBe(401);
	});
	
	it('should return client details when access token is valid', async () => {
		const hashservice = new HashService();
		const hashedPassword = await hashservice.make('password');
		const user = ClientRepository.create({
			firstName: 'John',
			lastName: 'Doe',
			email: 'foo@gmail.com',
			password: hashedPassword,
			avatar: 'https://www.gravatar.com/avatar',
		});
		const createdUser = await ClientRepository.save(user);

		const loginResponse = await request(app)
			.post('/api/login')
			.send({
				email: 'foo@gmail.com',
				password: 'password',
			});

		const { accessToken } = loginResponse.body as LoginResponseBody;
		
		expect(loginResponse.status).toBe(200);
		expect(accessToken).toBeDefined();

		const meResponse = await request(app).get('/api/users/me')
			.set('Authorization', `Bearer ${accessToken}`)
			.send();

		const { id, email } = meResponse.body as MeResponseBody;

		expect(meResponse.status).toBe(200);
		expect(id).toBeDefined();
		expect(id).toBe(createdUser.id);
		expect(email).toBeDefined();
		expect(email).toBe(createdUser.email);
	}, 10000);
});
