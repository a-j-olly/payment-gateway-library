import { describe, it, expect, vi } from "vitest";
import { Decimal } from "@prisma/client/runtime/library";
import { transfer } from "../../src";
import prisma from "../../src/lib/__mocks__/prisma";

vi.mock("../../src/lib/prisma");

describe("transfer", () => {
	it("should transfer amount between accounts", async () => {
		const fromAccountId = "1";
		const toAccountId = "2";
		const amount = 50;
		const fromInitialBalance = 200;
		const toInitialBalance = 100;
		prisma.account.findUnique
			.mockResolvedValueOnce({
				id: fromAccountId,
				balance: fromInitialBalance as unknown as Decimal,
			})
			.mockResolvedValueOnce({
				id: toAccountId,
				balance: toInitialBalance as unknown as Decimal,
			});

		await transfer(fromAccountId, toAccountId, amount);

		expect(prisma.account.update).toHaveBeenCalledWith({
			where: { id: fromAccountId },
			data: { balance: fromInitialBalance - amount },
		});
		expect(prisma.account.update).toHaveBeenCalledWith({
			where: { id: toAccountId },
			data: { balance: toInitialBalance + amount },
		});
		expect(prisma.transaction.create).toHaveBeenCalledWith({
			data: { type: "transfer_out", amount, accountId: fromAccountId },
		});
		expect(prisma.transaction.create).toHaveBeenCalledWith({
			data: { type: "transfer_in", amount, accountId: toAccountId },
		});
	});

	it("should throw error if from account not found", async () => {
		prisma.account.findUnique.mockResolvedValueOnce(null);

		await expect(transfer("1", "2", 50)).rejects.toThrow(
			"Account with ID 1 not found"
		);
	});

	it("should throw error if to account not found", async () => {
		const fromAccountId = "1";
		const toAccountId = "2";
		prisma.account.findUnique
			.mockResolvedValueOnce({
				id: fromAccountId,
				balance: 200 as unknown as Decimal,
			})
			.mockResolvedValueOnce(null);

		await expect(transfer(fromAccountId, toAccountId, 50)).rejects.toThrow(
			"Account with ID 2 not found"
		);
	});

	it("should throw error if insufficient balance", async () => {
		const fromAccountId = "1";
		const toAccountId = "2";
		prisma.account.findUnique
			.mockResolvedValueOnce({
				id: fromAccountId,
				balance: 100 as unknown as Decimal,
			})
			.mockResolvedValueOnce({
				id: toAccountId,
				balance: 200 as unknown as Decimal,
			});

		await expect(transfer(fromAccountId, toAccountId, 150)).rejects.toThrow(
			"Insufficient balance"
		);
	});
});
