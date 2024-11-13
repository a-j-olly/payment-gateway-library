import prisma from "./prisma";
import { findAccount, logOperation } from "./utils";

/**
 * Retrieves the current balance of a specified account.
 *
 * @param accountId - The unique identifier of the account to retrieve the balance for.
 *
 * @returns A promise that resolves to the current balance of the account.
 *
 * @throws Will throw an error if the account ID is not provided or if the account is not found.
 */
export async function getBalance(
	accountId: string
): Promise<number> {
	const account = await findAccount(prisma, accountId);

	logOperation(
		"Get_Balance",
		`Account ID: ${accountId}, Balance: ${account.balance}`
	);
	return Number(account.balance);
}
