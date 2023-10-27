import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1698585973279 implements MigrationInterface {
	name = 'Initial1698585973279'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('CREATE TABLE "photo" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "url" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "clientId" integer, CONSTRAINT "PK_723fa50bf70dcfd06fb5a44d4ff" PRIMARY KEY ("id"))');
		await queryRunner.query('CREATE TYPE "public"."client_role_enum" AS ENUM(\'admin\', \'client\')');
		await queryRunner.query('CREATE TABLE "client" ("id" SERIAL NOT NULL, "firstName" character varying(25) NOT NULL, "lastName" character varying(25) NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."client_role_enum" NOT NULL DEFAULT \'client\', "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "avatar" character varying NOT NULL, CONSTRAINT "UQ_6436cc6b79593760b9ef921ef12" UNIQUE ("email"), CONSTRAINT "PK_96da49381769303a6515a8785c7" PRIMARY KEY ("id"))');
		await queryRunner.query('ALTER TABLE "photo" ADD CONSTRAINT "FK_127a5532d24658ac9442b901286" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('ALTER TABLE "photo" DROP CONSTRAINT "FK_127a5532d24658ac9442b901286"');
		await queryRunner.query('DROP TABLE "client"');
		await queryRunner.query('DROP TYPE "public"."client_role_enum"');
		await queryRunner.query('DROP TABLE "photo"');
	}

}
