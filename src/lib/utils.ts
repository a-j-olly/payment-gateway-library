import { PrismaClient } from "@prisma/client";

/**
 * Finds an account by its ID. Throws an error if the ID is not provided or if the account is not found.
 *
 * @param client - The prisma client used to read the postgresql table.
 * @param accountId - The unique identifier of the account to find.
 * @returns The found account.
 * @throws Will throw an error if the account ID is not provided or if the account is not found.
 */
export async function findAccount(client: PrismaClient, accountId: string) {
	if (!accountId) {
		throw new Error("Account ID is required");
	}

	const account = await client.account.findUnique({ where: { id: accountId } });
	if (!account) {
		throw new Error(`Account with ID ${accountId} not found`);
	}
	return account;
}

export function validateAmount(amount: number) {
	if (isNaN(amount) || amount <= 0) {
		throw new Error("Amount must be a positive number");
	}
}

export function checkBalance(balance: number, amount: number) {
	if (balance < amount) {
		throw new Error(`Insufficient balance`);
	}
}

export function logOperation(operation: string, details: string) {
	console.log(`[${new Date().toISOString()}] ${operation}: ${details}`);
}
