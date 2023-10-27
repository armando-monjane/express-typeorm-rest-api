import request from 'supertest';
import App from '@app';
import { AppDataSource } from '@/data-source';
import { Application } from 'express';
import { ClientRepository } from '@/repositories/ClientRepository';
import { HashService } from '@/services/hash/HashService';
import { appConfig } from '@/config/app';

type BadRequestResponseBody = {
	success: boolean;
	message: string;
	errors: {
		[key: string]: string[];
	};
}

describe(`${appConfig.routePrefix}/login route`, () => {
	let app: Application;
	beforeAll(async () => {
		await App.bootstrap();
		app = App.app;
	}, 10000);

	afterAll(async () => {
		await AppDataSource.destroy();
	});

	it('should return bad request when password is not passed', async () => {
		const response = await request(app)
			.post('/api/login')
			.send({
				email: 'johndoe@example.com',
			});

		const responseBody = response.body as BadRequestResponseBody;

		expect(response.status).toBe(400);
		expect(responseBody.success).toBeFalsy();
		expect(responseBody.errors).toHaveProperty('password');
	});

	it('should return bad request when email is not passed', async () => {
		const response = await request(app)
			.post('/api/login')
			.send({
				password: 'password',
			});

		const responseBody = response.body as BadRequestResponseBody;

		expect(response.status).toBe(400);
		expect(responseBody.success).toBeFalsy();
		expect(responseBody.errors).toHaveProperty('email');
	});


	it('should return bad request when email is invalid', async () => {
		const response = await request(app)
			.post('/api/login')
			.send({
				email: 'bla-bla-invalid-email',
				password: 'password',
			});

		const responseBody = response.body as BadRequestResponseBody;

		expect(response.status).toBe(400);
		expect(responseBody.success).toBeFalsy();
		expect(responseBody.errors).toHaveProperty('email');
	});

	it('should return unauthorized when email is not registered', async () => {
		const response = await request(app)
			.post('/api/login')
			.send({
				email: 'foo@gmail.com',
				password: 'password',
			});

		const responseBody = response.body as BadRequestResponseBody;

		expect(response.status).toBe(401);
		expect(responseBody.success).toBeFalsy();
		expect(responseBody.message).toBe('Invalid credentials!');
	});
	
	it('should return access token when email and password are valid', async () => {
		const hashservice = new HashService();
		const hashedPassword = await hashservice.make('password');
		const user = ClientRepository.create({
			firstName: 'John',
			lastName: 'Doe',
			email: 'foo@gmail.com',
			password: hashedPassword,
			avatar: 'https://www.gravatar.com/avatar',
		});
		await ClientRepository.save(user);

		const response = await request(app)
			.post('/api/login')
			.send({
				email: 'foo@gmail.com',
				password: 'password',
			});
		
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('accessToken');
	}, 10000);

	it('should return unauthorized when user is not active', async () => {
		const user = await ClientRepository.findOne({where: {email: 'foo@gmail.com'}});

		if (user) {
			user.isActive = false;
			await ClientRepository.save(user);
		}

		const response = await request(app)
			.post('/api/login')
			.send({
				email: 'foo@gmail.com',
				password: 'password',
			});

		const responseBody = response.body as BadRequestResponseBody;

		expect(response.status).toBe(401);
		expect(responseBody.success).toBeFalsy();
		expect(responseBody.message).toBe('Invalid credentials!');
	});
});
