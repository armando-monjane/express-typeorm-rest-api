import { appConfig } from '@/config/app';
import { authConfig } from '@/config/auth';
import { Server } from 'http';

import { useContainer as routingControllersUseContainer, useExpressServer, getMetadataArgsStorage } from 'routing-controllers';
import { Container } from 'typedi';
import express from 'express';

import * as helmet from 'helmet';
import passport from 'passport';
import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';

import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUiExpress from 'swagger-ui-express';

import { AppDataSource } from '@/data-source';

export class App {
	private app: express.Application = express();
	private port = appConfig.port || 3000;
	private server!: Server;

	public constructor() {
		void this.bootstrap();
	}

	public async bootstrap(): Promise<void> {
		try {
			this.useContainers();
			await this.typeOrmCreateConnection();
			this.setupMiddlewares();
			this.registerControllers();
			this.setupSwagger();
			this.register404Route();
			this.configureServer();
		} catch (error) {
			console.log('Error during bootstrap:', error);
			process.exit(1);
		}
	}

	private useContainers() {
		routingControllersUseContainer(Container);
	}

	private async typeOrmCreateConnection() {
		try {
			await AppDataSource.initialize();
		} catch (error) {
			console.log(' Cannot connect to database: ', error);
		}
	}

	private setupMiddlewares() {
		// Helmet is used to secure this app by configuring the http-header
		this.app.use(helmet.default());

		// parse json request body
		this.app.use(express.json());

		// parse urlencoded request body
		this.app.use(express.urlencoded({ extended: true }));

		// Passport
		const options: StrategyOptions = {
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: authConfig.providers.jwt.secret,
		};

		const strategy = new Strategy(options, (payload: object, done) => {
			done(null, payload);
		});

		passport.use(strategy);
		this.app.use(passport.initialize());
	}

	private registerControllers() {
		useExpressServer(this.app, {
			validation: { stopAtFirstError: true },
			cors: true,
			classTransformer: true,
			defaultErrorHandler: false,
			routePrefix: appConfig.routePrefix,
			controllers: [`${__dirname}${appConfig.controllersDir}`],
			middlewares: [`${__dirname}${appConfig.middlewaresDir}`],
		});
	}

	private register404Route() {
		this.app.get('*', (_req, res) => {
			if (!res.headersSent) {
				res.status(404).send({ status: 404, message: 'Not Found!' });
			}
		});
	}

	exitHandler(): void {
		this.server.close(() => {
			console.log('Server closed');
			//  TODO: add logger
			// logger.info('Server closed');
			process.exit(1);
		});
	};

	unexpectedErrorHandler(error: Error): void {
		console.error(error);
		// logger.error(error);
		this.exitHandler();
	};

	private configureServer() {
		this.server = this.app.listen(this.port, (): void => {
			console.log(`Environment: ${process.env.NODE_ENV} Application listening on PORT: ${this.port}`);
			// logger.info(`Environment: ${process.env.NODE_ENV} Application listening on PORT: ${this.port}`);
		});

		process.on('uncaughtException', (err) => this.unexpectedErrorHandler(err));
		process.on('unhandledRejection', (reason: Error) => {
			throw reason;
		});

		process.on('SIGTERM', () => {
			console.log('SIGTERM received');
			//   logger.info('SIGTERM received');
			if (this.server) {
				this.server.close();
			}
		});
	}

	private setupSwagger() {
		// Parse class-validator classes into JSON Schema

		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		const schemas = validationMetadatasToSchemas() as { [key: string]: object; };

		// Parse routing-controllers classes into OpenAPI spec:
		const storage = getMetadataArgsStorage();
		const spec = routingControllersToSpec(
			storage,
			{ routePrefix: appConfig.routePrefix },
			{
				components: {
					schemas,
					securitySchemes: {
						bearerAuth: {
							type: 'http',
							scheme: 'bearer',
							bearerFormat: 'JWT',
						},
					},
				},
				info: {
					description: 'Welcome to the club!',
					title: 'API Documentation',
					version: '1.0.0'
				},
			},
		);

		// Use Swagger UI for express
		const { serve } = swaggerUiExpress;
		this.app.use('/docs', serve, swaggerUiExpress.setup(spec));
	}
}

new App();