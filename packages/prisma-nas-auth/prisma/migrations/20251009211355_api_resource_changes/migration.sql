-- CreateEnum
CREATE TYPE "auth"."ApiResourceAccessTokenFormat" AS ENUM ('jwt', 'opaque');

-- AlterTable
ALTER TABLE "auth"."api_resource"
  DROP COLUMN "paseto",
  DROP COLUMN "accessTokenFormat",
  ADD COLUMN  "accessTokenFormat" "auth"."ApiResourceAccessTokenFormat" NOT NULL DEFAULT 'jwt';
