import { describe, it, expect, vi } from "vitest";
import { Decimal } from "@prisma/client/runtime/library";
import { deposit } from "../../src";
import prisma from "../../src/lib/__mocks__/prisma";

vi.mock("../../src/lib/prisma");

describe("deposit", () => {
	it("should deposit amount to account", async () => {
		const accountId = "1";
		const amount = 100;
		const initialBalance = 200;
		const expectedBalance = initialBalance + amount;
		prisma.account.findUnique.mockResolvedValue({
			id: accountId,
			balance: initialBalance as unknown as Decimal,
		});
		prisma.account.update.mockResolvedValue({
			id: accountId,
			balance: (initialBalance + amount) as unknown as Decimal,
		});

		await deposit(accountId, amount);

		expect(prisma.account.update).toHaveBeenCalledWith({
			where: { id: accountId },
			data: { balance: expectedBalance },
		});
		expect(prisma.transaction.create).toHaveBeenCalledWith({
			data: { type: "deposit", amount, accountId },
		});
	});

	it("should throw error if account not found", async () => {
		prisma.account.findUnique.mockResolvedValue(null);

		await expect(deposit("1", 100)).rejects.toThrow(
			"Account with ID 1 not found"
		);
	});
});
