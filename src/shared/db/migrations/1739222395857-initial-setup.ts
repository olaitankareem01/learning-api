import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSetup1739222395857 implements MigrationInterface {
    name = 'InitialSetup1739222395857'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "topic" ADD "image" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "topic" ADD "audio" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subject" ADD "description" character varying`);
        await queryRunner.query(`ALTER TABLE "topic" ALTER COLUMN "description" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "topic" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subject" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "topic" DROP COLUMN "audio"`);
        await queryRunner.query(`ALTER TABLE "topic" DROP COLUMN "image"`);
    }

}
