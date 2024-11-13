/* v8 ignore start */
// This is a script to populate a PostgreSQL database for testing

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	// Delete all existing data
	await prisma.transaction.deleteMany({});
	await prisma.account.deleteMany({});

	const now = new Date().toISOString();

	// Create sample accounts
	const account1 = await prisma.account.create({
		data: {
			id: "account1",
			balance: 800,
		},
	});

	const account2 = await prisma.account.create({
		data: {
			id: "account2",
			balance: 1700,
		},
	});

	const account3 = await prisma.account.create({
		data: {
			id: "account3",
			balance: 30000,
		},
	});

	const account4 = await prisma.account.create({
		data: {
			id: "account4",
			balance: 15000,
		},
	});

	// Create sample transactions
	await prisma.transaction.create({
		data: {
			id: "transaction1",
			type: "deposit",
			amount: 1000,
			accountId: account1.id,
			createdAt: now,
		},
	});

	await prisma.transaction.create({
		data: {
			id: "transaction2",
			type: "deposit",
			amount: 2000,
			accountId: account2.id,
			createdAt: now,
		},
	});

	await prisma.transaction.create({
		data: {
			id: "transaction3",
			type: "withdrawal",
			amount: 500,
			accountId: account1.id,
			createdAt: now,
		},
	});

	await prisma.transaction.create({
		data: {
			id: "transaction4",
			type: "transfer-out",
			amount: 300,
			accountId: account2.id,
			createdAt: now,
		},
	});

	await prisma.transaction.create({
		data: {
			id: "transaction5",
			type: "transfer-in",
			amount: 300,
			accountId: account1.id,
			createdAt: now,
		},
	});

	await prisma.transaction.create({
		data: {
			id: "transaction6",
			type: "deposit",
			amount: 30000,
			accountId: account3.id,
			createdAt: now,
		},
	});

	await prisma.transaction.create({
		data: {
			id: "transaction7",
			type: "deposit",
			amount: 15000,
			accountId: account4.id,
			createdAt: now,
		},
	});

	console.log("Sample data has been loaded successfully.");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
