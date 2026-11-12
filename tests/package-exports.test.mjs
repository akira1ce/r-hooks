import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);

test("the CommonJS package entry loads with require", () => {
	const hooks = require("@akira1ce/r-hooks");
	assert.equal(typeof hooks.useQuery, "function");
});

test("the ES module package entry loads with import", async () => {
	const hooks = await import("@akira1ce/r-hooks");
	assert.equal(typeof hooks.useQuery, "function");
});
