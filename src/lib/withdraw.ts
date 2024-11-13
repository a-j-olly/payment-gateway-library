import prisma from "./prisma";
import {
	checkBalance,
	findAccount,
	logOperation,
	validateAmount,
} from "./utils";

/**
 * Withdraws an amount from the specified account.
 *
 * @param accountId - The unique identifier of the account to withdraw from.
 * @param amount - The amount to withdraw. Must be a positive number.
 *
 * @throws Will throw an error if the account ID is not provided or if the account is not found.
 * @throws Will throw an error if the amount is not a positive number.
 * @throws Will throw an error if the withdrawal operation fails due to insufficient balance or database constraints or errors.
 */
export async function withdraw(
	accountId: string,
	amount: number
): Promise<void> {
	validateAmount(amount);
	const account = await findAccount(prisma, accountId);

	checkBalance(Number(account.balance), amount);
	const newBalance = Number(account.balance) - amount;

	await prisma.$transaction([
		prisma.account.update({
			where: { id: accountId },
			data: { balance: newBalance },
		}),
		prisma.transaction.create({
			data: { type: "withdrawal", amount, accountId },
		}),
	]);

	logOperation(
		"Withdrawal",
		`Account ID: ${accountId}, Amount: ${amount}, New Balance: ${newBalance}`
	);
	return;
}
