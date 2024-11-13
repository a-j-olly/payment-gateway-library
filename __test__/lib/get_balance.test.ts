import { describe, it, expect, vi } from "vitest";
import { Decimal } from "@prisma/client/runtime/library";
import { getBalance } from "../../src";
import prisma from "../../src/lib/__mocks__/prisma";

vi.mock("../../src/lib/prisma");

describe("getBalance", () => {
	it("should return the balance of an account", async () => {
		const accountId = "1";
		const balance = 100 as unknown as Decimal;
		prisma.account.findUnique.mockResolvedValue({ id: accountId, balance });

		const accountBalance = await getBalance(accountId);

		expect(accountBalance).toBe(balance);
	});

	it("should throw error if account not found", async () => {
		prisma.account.findUnique.mockResolvedValue(null);

		await expect(getBalance("1")).rejects.toThrow(
			"Account with ID 1 not found"
		);
	});
});
