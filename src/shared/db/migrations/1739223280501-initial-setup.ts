import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSetup1739223280501 implements MigrationInterface {
    name = 'InitialSetup1739223280501'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "topic" ALTER COLUMN "video" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "topic" ALTER COLUMN "image" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "topic" ALTER COLUMN "audio" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "topic" ALTER COLUMN "audio" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "topic" ALTER COLUMN "image" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "topic" ALTER COLUMN "video" SET NOT NULL`);
    }

}
