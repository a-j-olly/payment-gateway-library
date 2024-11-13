import { describe, it, expect, vi } from "vitest";
import { Decimal } from "@prisma/client/runtime/library";
import { getTransactionHistory } from "../../src";
import prisma from "../../src/lib/__mocks__/prisma";

vi.mock("../../src/lib/prisma");

describe("getTransactionHistory", () => {
	it("should return the transaction history of an account", async () => {
		const accountId = "1";
		const transactions = [
			{
				id: "1",
				type: "deposit",
				amount: 100 as unknown as Decimal,
				accountId,
				createdAt: new Date(),
			},
			{
				id: "2",
				type: "withdrawal",
				amount: 50 as unknown as Decimal,
				accountId,
				createdAt: new Date(),
			},
		];
		prisma.transaction.findMany.mockResolvedValue(transactions);

		const history = await getTransactionHistory(accountId);

		expect(history).toEqual(transactions);
	});
});
