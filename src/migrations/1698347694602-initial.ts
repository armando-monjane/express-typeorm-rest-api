import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1698347694602 implements MigrationInterface {
	name = 'Initial1698347694602'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('CREATE TABLE "photo" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "url" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_723fa50bf70dcfd06fb5a44d4ff" PRIMARY KEY ("id"))');
		await queryRunner.query('CREATE TYPE "public"."user_role_enum" AS ENUM(\'admin\', \'client\')');
		await queryRunner.query('CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying(25) NOT NULL, "lastName" character varying(25) NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT \'client\', "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))');
		await queryRunner.query('CREATE TABLE "client" ("id" SERIAL NOT NULL, "avatar" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "REL_f18a6fabea7b2a90ab6bf10a65" UNIQUE ("user_id"), CONSTRAINT "PK_96da49381769303a6515a8785c7" PRIMARY KEY ("id"))');
		await queryRunner.query('ALTER TABLE "photo" ADD CONSTRAINT "FK_c8c60110b38af9f778106552c39" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
		await queryRunner.query('ALTER TABLE "client" ADD CONSTRAINT "FK_f18a6fabea7b2a90ab6bf10a650" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('ALTER TABLE "client" DROP CONSTRAINT "FK_f18a6fabea7b2a90ab6bf10a650"');
		await queryRunner.query('ALTER TABLE "photo" DROP CONSTRAINT "FK_c8c60110b38af9f778106552c39"');
		await queryRunner.query('DROP TABLE "client"');
		await queryRunner.query('DROP TABLE "user"');
		await queryRunner.query('DROP TYPE "public"."user_role_enum"');
		await queryRunner.query('DROP TABLE "photo"');
	}

}
