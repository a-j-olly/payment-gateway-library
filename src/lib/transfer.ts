import prisma from "./prisma";
import {
	checkBalance,
	findAccount,
	logOperation,
	validateAmount,
} from "./utils";

/**
 * Transfers an amount from one account to another.
 *
 * @param fromAccountId - The unique identifier of the account to transfer from.
 * @param toAccountId - The unique identifier of the account to transfer to.
 * @param amount - The amount to transfer. Must be a positive number.
 *
 * @throws Will throw an error if the from or to account IDs are not provided or if the accounts are not found.
 * @throws Will throw an error if the amount is not a positive number.
 * @throws Will throw an error if the transfer operation fails due to insufficient balance or database constraints or errors.
 */
export async function transfer(
	fromAccountId: string,
	toAccountId: string,
	amount: number
): Promise<void> {
	validateAmount(amount);
	const fromAccount = await findAccount(prisma, fromAccountId);
	const toAccount = await findAccount(prisma, toAccountId);

	checkBalance(Number(fromAccount.balance), amount);

	const newFromBalance = Number(fromAccount.balance) - amount;
	const newToBalance = Number(toAccount.balance) + amount;

	await prisma.$transaction([
		prisma.account.update({
			where: { id: fromAccountId },
			data: { balance: newFromBalance },
		}),
		prisma.transaction.create({
			data: {
				type: "transfer_out",
				amount,
				accountId: fromAccountId,
			},
		}),
		prisma.account.update({
			where: { id: toAccountId },
			data: { balance: newToBalance },
		}),
		prisma.transaction.create({
			data: {
				type: "transfer_in",
				amount,
				accountId: toAccountId,
			},
		}),
	]);

	logOperation(
		"Transfer",
		`From Account ID: ${fromAccountId}, To Account ID: ${toAccountId}, Amount: ${amount}, New From Balance: ${newFromBalance}, New To Balance: ${newToBalance}`
	);
	return;
}
