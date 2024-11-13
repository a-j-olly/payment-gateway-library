import prisma from "./prisma";
import { checkBalance, findAccount, logOperation } from "./utils";

/**
 * Refunds a transaction by reversing the original operation.
 *
 * @param transactionId - The unique identifier of the transaction to refund.
 *
 * @throws Will throw an error if the transaction ID is not provided or if the transaction is not found.
 * @throws Will throw an error if the transaction type is "refund", as refunding a refund transaction is not allowed.
 * @throws Will throw an error if the refund operation fails due to insufficient balance or database constraints or errors.
 */
export async function refund(transactionId: string): Promise<void> {
	const transaction = await prisma.transaction.findUnique({
		where: { id: transactionId },
	});
	if (!transaction) {
		throw new Error(`Transaction with ID ${transactionId} not found`);
	}
	if (transaction.type === "refund") {
		throw new Error("Cannot refund a refund transaction");
	}

	const account = await findAccount(prisma, transaction.accountId);
	let newBalance;
	let operation;
	switch (transaction.type) {
		case "deposit":
		case "transfer-in":
			checkBalance(Number(account.balance), Number(transaction.amount));
			newBalance = Number(account.balance) - Number(transaction.amount);

			operation = prisma.account.update({
				where: { id: transaction.accountId },
				data: { balance: newBalance },
			});
			break;
		case "withdrawal":
		case "transfer-out":
			newBalance = Number(account.balance) + Number(transaction.amount);
			operation = prisma.account.update({
				where: { id: transaction.accountId },
				data: { balance: newBalance },
			});
			break;
		default:
			throw new Error(`Unsupported transaction type: ${transaction.type}`);
	}

	await prisma.$transaction([
		operation,
		prisma.transaction.create({
			data: {
				type: "refund",
				amount: transaction.amount,
				accountId: transaction.accountId,
			},
		}),
	]);

	logOperation(
		"Refund",
		`Transaction ID: ${transactionId}, Account ID: ${transaction.accountId}, Amount: ${transaction.amount}, New Balance: ${newBalance}`
	);
	return;
}
