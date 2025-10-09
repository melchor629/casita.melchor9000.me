-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateTable
CREATE TABLE "auth"."api_resource" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR(500) NOT NULL,
    "name" VARCHAR(1000) NOT NULL,
    "scopes" JSONB NOT NULL,
    "audience" VARCHAR(1000) NOT NULL,
    "accessTokenFormat" VARCHAR(50) NOT NULL DEFAULT 'jwt',
    "accessTokenTTL" INTEGER,
    "jwt" JSONB,
    "paseto" JSONB,
    "applicationId" INTEGER NOT NULL,

    CONSTRAINT "PK_f80ccb48a19c807aa53d90dd66b" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."application" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR(32) NOT NULL,
    "name" VARCHAR(500) NOT NULL,

    CONSTRAINT "PK_b50aa5a1c0644e601c0cdbf986d" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."client" (
    "id" SERIAL NOT NULL,
    "clientId" VARCHAR(128) NOT NULL,
    "clientName" VARCHAR(1024) NOT NULL,
    "fields" JSONB NOT NULL,

    CONSTRAINT "PK_96da49381769303a6515a8785c7" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."login" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "loginId" VARCHAR(2048) NOT NULL,
    "data" JSONB,
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PK_0e29aa96b7d3fb812ff43fcfcd3" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."permission" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "applicationId" INTEGER NOT NULL,
    "displayName" VARCHAR(1000),

    CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."user" (
    "id" SERIAL NOT NULL,
    "userName" VARCHAR(100) NOT NULL,
    "displayName" VARCHAR(512) NOT NULL,
    "email" VARCHAR(1024),
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "familyName" VARCHAR(512),
    "givenName" VARCHAR(512),
    "profileImageUrl" VARCHAR(4096),

    CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."user_permission" (
    "id" SERIAL NOT NULL,
    "write" BOOLEAN NOT NULL DEFAULT false,
    "delete" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,

    CONSTRAINT "PK_a7326749e773c740a7104634a77" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "api-resource-key-unique" ON "auth"."api_resource"("key");

-- CreateIndex
CREATE UNIQUE INDEX "application-apiKey-unique" ON "auth"."application"("key");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_6ed9067942d7537ce359e172ff6" ON "auth"."client"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "IDX_204cd5e1949e4f4f73139dc7d0" ON "auth"."login"("type", "loginId");

-- CreateIndex
CREATE UNIQUE INDEX "permission-name-application-key" ON "auth"."permission"("name", "applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "IDX_1cf6c7f47d0655afa389e1bd59" ON "auth"."user_permission"("userId", "permissionId");

-- AddForeignKey
ALTER TABLE "auth"."api_resource" ADD CONSTRAINT "FK_7c34867275a5cc746b6d4fd75ed" FOREIGN KEY ("applicationId") REFERENCES "auth"."application"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth"."login" ADD CONSTRAINT "FK_b1c3fff7c4bc7d15b3018abab6f" FOREIGN KEY ("userId") REFERENCES "auth"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth"."permission" ADD CONSTRAINT "FK_2a032717ceae31ffbbc72a4805b" FOREIGN KEY ("applicationId") REFERENCES "auth"."application"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth"."user_permission" ADD CONSTRAINT "FK_a592f2df24c9d464afd71401ff6" FOREIGN KEY ("permissionId") REFERENCES "auth"."permission"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth"."user_permission" ADD CONSTRAINT "FK_deb59c09715314aed1866e18a81" FOREIGN KEY ("userId") REFERENCES "auth"."user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

