import { describe, it, expect, vi } from "vitest";
import { validateAmount, logOperation } from "../../src/lib/utils";

vi.spyOn(console, "log").mockImplementation(() => {});

describe("validateAmount", () => {
	it("should throw an error for non-positive amounts", () => {
		expect(() => validateAmount(-1)).toThrow(
			"Amount must be a positive number"
		);
		expect(() => validateAmount(0)).toThrow("Amount must be a positive number");
	});

	it("should not throw an error for positive amounts", () => {
		expect(() => validateAmount(1)).not.toThrow();
		expect(() => validateAmount(100)).not.toThrow();
	});

	it("should throw an error for non-numeric amounts", () => {
		expect(() => validateAmount(NaN)).toThrow(
			"Amount must be a positive number"
		);
	});
});

describe("logOperation", () => {
	it("should log the operation details with a timestamp", () => {
		const operation = "Deposit";
		const details = "Account ID: 1, Amount: 100, New Balance: 200";

		logOperation(operation, details);

		expect(console.log).toHaveBeenCalledWith(
			expect.stringContaining(`[${new Date().toISOString().substring(0, 10)}`)
		);
	});

	it("should log the correct operation type and details", () => {
		const operation = "Withdrawal";
		const details = "Account ID: 2, Amount: 50, New Balance: 150";

		logOperation(operation, details);

		expect(console.log).toHaveBeenCalledWith(
			expect.stringContaining(`${operation}: ${details}`)
		);
	});
});
