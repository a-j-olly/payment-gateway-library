import prisma from "./prisma";
import { findAccount, logOperation, validateAmount } from "./utils";

/**
 * Deposits an amount into the specified account.
 *
 * @param accountId - The unique identifier of the account to deposit into.
 * @param amount - The amount to deposit. Must be a positive number.
 *
 * @throws Will throw an error if the account ID is not provided or if the account is not found.
 * @throws Will throw an error if the amount is not a positive number.
 * @throws Will throw an error if the deposit operation fails due to database constraints or errors.
 */
export async function deposit(
	accountId: string,
	amount: number
): Promise<void> {
	validateAmount(amount);

	const account = await findAccount(prisma, accountId);
	const newBalance = Number(account.balance) + amount;

	await prisma.$transaction([
		prisma.account.update({
			where: { id: accountId },
			data: { balance: newBalance },
		}),
		prisma.transaction.create({
			data: { type: "deposit", amount, accountId },
		}),
	]);

	logOperation(
		"Deposit",
		`Account ID: ${accountId}, Amount: ${amount}, New Balance: ${newBalance}`
	);
	return;
}
