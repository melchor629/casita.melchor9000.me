-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations

CREATE SCHEMA "auth";
--> statement-breakpoint
CREATE TYPE "auth"."ApiResourceAccessTokenFormat" AS ENUM('jwt', 'opaque');
--> statement-breakpoint
CREATE TABLE "auth"."api_resource" (
	"id" serial,
	"key" varchar(500) NOT NULL,
	"name" varchar(1000) NOT NULL,
	"scopes" jsonb NOT NULL,
	"audience" varchar(1000) NOT NULL,
	"accessTokenTTL" integer,
	"jwt" jsonb,
	"applicationId" integer NOT NULL,
	"accessTokenFormat" "auth"."ApiResourceAccessTokenFormat" DEFAULT 'jwt'::"auth"."ApiResourceAccessTokenFormat" NOT NULL,
	CONSTRAINT "PK_f80ccb48a19c807aa53d90dd66b" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "auth"."application" (
	"id" serial,
	"key" varchar(32) NOT NULL,
	"name" varchar(500) NOT NULL,
	CONSTRAINT "PK_b50aa5a1c0644e601c0cdbf986d" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "auth"."client" (
	"id" serial,
	"clientId" varchar(128) NOT NULL CONSTRAINT "UQ_6ed9067942d7537ce359e172ff6" UNIQUE,
	"clientName" varchar(1024) NOT NULL,
	"fields" jsonb NOT NULL,
	CONSTRAINT "PK_96da49381769303a6515a8785c7" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "auth"."login" (
	"id" serial,
	"type" varchar(50) NOT NULL,
	"loginId" varchar(2048) NOT NULL,
	"data" jsonb,
	"disabled" boolean DEFAULT false NOT NULL,
	"userId" integer NOT NULL,
	CONSTRAINT "PK_0e29aa96b7d3fb812ff43fcfcd3" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "auth"."permission" (
	"id" serial,
	"name" varchar(100) NOT NULL,
	"applicationId" integer NOT NULL,
	"displayName" varchar(1000),
	CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY("id"),
	CONSTRAINT "permission-name-application-key" UNIQUE("name","applicationId")
);
--> statement-breakpoint
CREATE TABLE "auth"."user" (
	"id" serial,
	"userName" varchar(100) NOT NULL,
	"displayName" varchar(512) NOT NULL,
	"email" varchar(1024),
	"disabled" boolean DEFAULT false NOT NULL,
	"familyName" varchar(512),
	"givenName" varchar(512),
	"profileImageUrl" varchar(4096),
	CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "auth"."user_permission" (
	"id" serial,
	"write" boolean DEFAULT false NOT NULL,
	"delete" boolean DEFAULT false NOT NULL,
	"userId" integer NOT NULL,
	"permissionId" integer NOT NULL,
	CONSTRAINT "PK_a7326749e773c740a7104634a77" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "api-resource-key-unique" ON "auth"."api_resource" ("key");
--> statement-breakpoint
CREATE UNIQUE INDEX "application-apiKey-unique" ON "auth"."application" ("key");
--> statement-breakpoint
CREATE UNIQUE INDEX "IDX_1cf6c7f47d0655afa389e1bd59" ON "auth"."user_permission" ("userId","permissionId");
--> statement-breakpoint
CREATE UNIQUE INDEX "IDX_204cd5e1949e4f4f73139dc7d0" ON "auth"."login" ("type","loginId");
--> statement-breakpoint
ALTER TABLE "auth"."login" ADD CONSTRAINT "FK_b1c3fff7c4bc7d15b3018abab6f" FOREIGN KEY ("userId") REFERENCES "auth"."user"("id");
--> statement-breakpoint
ALTER TABLE "auth"."permission" ADD CONSTRAINT "FK_2a032717ceae31ffbbc72a4805b" FOREIGN KEY ("applicationId") REFERENCES "auth"."application"("id") ON DELETE CASCADE;
--> statement-breakpoint
ALTER TABLE "auth"."user_permission" ADD CONSTRAINT "FK_a592f2df24c9d464afd71401ff6" FOREIGN KEY ("permissionId") REFERENCES "auth"."permission"("id") ON DELETE CASCADE;
--> statement-breakpoint
ALTER TABLE "auth"."user_permission" ADD CONSTRAINT "FK_deb59c09715314aed1866e18a81" FOREIGN KEY ("userId") REFERENCES "auth"."user"("id") ON DELETE CASCADE;
--> statement-breakpoint
ALTER TABLE "auth"."api_resource" ADD CONSTRAINT "FK_7c34867275a5cc746b6d4fd75ed" FOREIGN KEY ("applicationId") REFERENCES "auth"."application"("id");
