import { describe, it, expect, vi } from "vitest";
import { Decimal } from "@prisma/client/runtime/library";
import { refund } from "../../src";
import prisma from "../../src/lib/__mocks__/prisma";

vi.mock("../../src/lib/prisma");

describe("refund", () => {
	it("should refund a withdrawal transaction", async () => {
		const transactionId = "1";
		const accountId = "1";
		const amount = 100 as unknown as Decimal;
		const initialBalance = 200;
		prisma.transaction.findUnique.mockResolvedValue({
			id: transactionId,
			amount: amount,
			type: "withdrawal",
			accountId,
			createdAt: new Date(),
		});
		prisma.account.findUnique.mockResolvedValue({
			id: accountId,
			balance: initialBalance as unknown as Decimal,
		});

		await refund(transactionId);

		expect(prisma.account.update).toHaveBeenCalledWith({
			where: { id: accountId },
			data: { balance: initialBalance + Number(amount) },
		});
		expect(prisma.transaction.create).toHaveBeenCalledWith({
			data: { type: "refund", amount: amount, accountId: accountId },
		});
	});

	it("should refund a deposit transaction", async () => {
		const transactionId = "1";
		const accountId = "1";
		const amount = 200 as unknown as Decimal;
		const initialBalance = 600;
		prisma.transaction.findUnique.mockResolvedValue({
			id: transactionId,
			amount: amount,
			type: "deposit",
			accountId,
			createdAt: new Date(),
		});
		prisma.account.findUnique.mockResolvedValue({
			id: accountId,
			balance: initialBalance as unknown as Decimal,
		});

		await refund(transactionId);

		expect(prisma.account.update).toHaveBeenCalledWith({
			where: { id: accountId },
			data: { balance: initialBalance - Number(amount) },
		});
		expect(prisma.transaction.create).toHaveBeenCalledWith({
			data: { type: "refund", amount: amount, accountId: accountId },
		});
	});

	it("should throw error if transaction not found", async () => {
		prisma.transaction.findUnique.mockResolvedValue(null);

		await expect(refund("1")).rejects.toThrow(
			"Transaction with ID 1 not found"
		);
	});

	it("should throw error if account not found", async () => {
		const transactionId = "1";
		prisma.transaction.findUnique.mockResolvedValue({
			id: transactionId,
			amount: 100 as unknown as Decimal,
			type: "withdrawal",
			accountId: "1",
			createdAt: new Date(),
		});
		prisma.account.findUnique.mockResolvedValue(null);

		await expect(refund(transactionId)).rejects.toThrow(
			"Account with ID 1 not found"
		);
	});

	it("should throw error if transaction type is refund", async () => {
		const transactionId = "1";
		prisma.transaction.findUnique.mockResolvedValue({
			id: transactionId,
			amount: 100 as unknown as Decimal,
			type: "refund",
			accountId: "1",
			createdAt: new Date(),
		});

		await expect(refund(transactionId)).rejects.toThrow(
			"Cannot refund a refund transaction"
		);
	});
});
