import { describe, it, expect } from "vitest";
import { PrismaClient } from "@prisma/client";
import prisma from "../../src/lib/prisma";

describe("PrismaClient Initialization", () => {
	it("should correctly initialize PrismaClient and export it", () => {
		expect(prisma).toBeInstanceOf(PrismaClient);
	});
});
