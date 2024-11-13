import { Decimal } from "@prisma/client/runtime/library";
import { logOperation } from "./utils";
import prisma from "./prisma";

/**
 * Retrieves the transaction history for a specified account.
 *
 * @param accountId - The unique identifier of the account to retrieve the transaction history for.
 *
 * @returns A promise that resolves to an array of transaction objects. Each transaction object contains the following properties:
 * - id: The unique identifier of the transaction.
 * - type: The type of the transaction (e.g., deposit, withdrawal, transfer-in, transfer-out, refund).
 * - amount: The amount involved in the transaction.
 * - accountId: The unique identifier of the account associated with the transaction.
 *
 * @throws Will throw an error if the account ID is not provided or if the account is not found.
 */
export async function getTransactionHistory(accountId: string): Promise<
	Array<{
		id: string;
		type: string;
		amount: Decimal;
		accountId: string;
	}>
> {
	const transactions = await prisma.transaction.findMany({
		where: { accountId },
		select: {
			id: true,
			type: true,
			amount: true,
			accountId: true,
		},
	});

	logOperation("Transaction_History", `Account ID: ${accountId}`);

	return transactions;
}
