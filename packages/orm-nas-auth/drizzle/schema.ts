import { pgSchema, serial, varchar, boolean, integer, jsonb, uniqueIndex, unique } from "drizzle-orm/pg-core"

export const auth = pgSchema("auth");
export const ApiResourceAccessTokenFormat = auth.enum("ApiResourceAccessTokenFormat", ["jwt", "opaque"])


export const apiResource = auth.table("api_resource", {
	id: serial().primaryKey(),
	key: varchar({ length: 500 }).notNull(),
	name: varchar({ length: 1000 }).notNull(),
	scopes: jsonb().notNull(),
	audience: varchar({ length: 1000 }).notNull(),
	accessTokenTTL: integer(),
	jwt: jsonb(),
	applicationId: integer().notNull().references(() => application.id),
	accessTokenFormat: ApiResourceAccessTokenFormat().default("jwt").notNull(),
}, (table) => [
	uniqueIndex("api-resource-key-unique").using("btree", table.key.asc().nullsLast()),
]);

export const application = auth.table("application", {
	id: serial().primaryKey(),
	key: varchar({ length: 32 }).notNull(),
	name: varchar({ length: 500 }).notNull(),
}, (table) => [
	uniqueIndex("application-apiKey-unique").using("btree", table.key.asc().nullsLast()),
]);

export const client = auth.table("client", {
	id: serial().primaryKey(),
	clientId: varchar({ length: 128 }).notNull(),
	clientName: varchar({ length: 1024 }).notNull(),
	fields: jsonb().notNull(),
}, (table) => [
	unique("UQ_6ed9067942d7537ce359e172ff6").on(table.clientId),]);

export const login = auth.table("login", {
	id: serial().primaryKey(),
	type: varchar({ length: 50 }).notNull(),
	loginId: varchar({ length: 2048 }).notNull(),
	data: jsonb(),
	disabled: boolean().default(false).notNull(),
	userId: integer().notNull().references(() => user.id),
}, (table) => [
	uniqueIndex("IDX_204cd5e1949e4f4f73139dc7d0").using("btree", table.type.asc().nullsLast(), table.loginId.asc().nullsLast()),
]);

export const permission = auth.table("permission", {
	id: serial().primaryKey(),
	name: varchar({ length: 100 }).notNull(),
	applicationId: integer().notNull().references(() => application.id, { onDelete: "cascade" } ),
	displayName: varchar({ length: 1000 }),
}, (table) => [
	unique("permission-name-application-key").on(table.name, table.applicationId),]);

export const user = auth.table("user", {
	id: serial().primaryKey(),
	userName: varchar({ length: 100 }).notNull(),
	displayName: varchar({ length: 512 }).notNull(),
	email: varchar({ length: 1024 }),
	disabled: boolean().default(false).notNull(),
	familyName: varchar({ length: 512 }),
	givenName: varchar({ length: 512 }),
	profileImageUrl: varchar({ length: 4096 }),
});

export const userPermission = auth.table("user_permission", {
	id: serial().primaryKey(),
	write: boolean().default(false).notNull(),
	delete: boolean().default(false).notNull(),
	userId: integer().notNull().references(() => user.id, { onDelete: "cascade" } ),
	permissionId: integer().notNull().references(() => permission.id, { onDelete: "cascade" } ),
}, (table) => [
	uniqueIndex("IDX_1cf6c7f47d0655afa389e1bd59").using("btree", table.userId.asc().nullsLast(), table.permissionId.asc().nullsLast()),
]);
